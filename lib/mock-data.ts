import { addDays, startOfYear, subDays, subMonths } from "date-fns";
import type {
  DateRangePreset,
  Deal,
  DealStage,
  LeadSourceSlice,
  MetricCard,
  RevenueMonth,
} from "@/lib/types";

const STAGES: DealStage[] = [
  "Negotiation",
  "Proposal Sent",
  "Qualified",
  "Discovery",
];

const OWNERS = [
  { name: "Sarah Chen", initials: "SC" },
  { name: "Marcus Webb", initials: "MW" },
  { name: "Elena Ruiz", initials: "ER" },
  { name: "James Okonjo", initials: "JO" },
  { name: "Priya Nair", initials: "PN" },
];

const CLIENTS = [
  "TechCorp",
  "Fintra",
  "Nova Labs",
  "BluePeak",
  "Apex Systems",
  "Northwind",
  "Sterling Co",
  "Vanta Group",
  "Pulse AI",
  "Meridian",
];

const DEAL_PREFIXES = [
  "Enterprise",
  "Platform",
  "Cloud",
  "Security",
  "Analytics",
  "Integration",
  "Upgrade",
  "Expansion",
  "Pilot",
  "Renewal",
];

function hashSeed(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h << 5) - h + id.charCodeAt(i);
  return Math.abs(h);
}

/** Deterministic pseudo-random 0..1 from id */
function seededUnit(id: string, salt: number): number {
  const x = Math.sin(hashSeed(id) + salt) * 10000;
  return x - Math.floor(x);
}

export function buildDeals(): Deal[] {
  const deals: Deal[] = [];
  for (let i = 1; i <= 50; i++) {
    const id = `deal-${i}`;
    const su = seededUnit(id, 1);
    const su2 = seededUnit(id, 2);
    const su3 = seededUnit(id, 3);
    const client = CLIENTS[Math.floor(su * CLIENTS.length)];
    const prefix = DEAL_PREFIXES[Math.floor(su2 * DEAL_PREFIXES.length)];
    const stage = STAGES[Math.floor(su3 * STAGES.length)];
    const owner = OWNERS[Math.floor(seededUnit(id, 4) * OWNERS.length)];
    const value = Math.round(8000 + seededUnit(id, 5) * 32000);
    const daysAhead = Math.floor(10 + seededUnit(id, 6) * 120);
    const expectedClose = addDays(new Date(), daysAhead - 30).toISOString();
    const initials = client
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    deals.push({
      id,
      dealName: `${prefix} — ${client}`,
      client,
      stage,
      value,
      owner,
      expectedClose,
      dealInitials: initials,
    });
  }
  return deals;
}

export const MOCK_DEALS = buildDeals();

export const MOCK_LEAD_SOURCES: LeadSourceSlice[] = [
  { source: "Website", count: 1445 },
  { source: "Paid Ads", count: 903 },
  { source: "Emails", count: 722 },
  { source: "Referral", count: 451 },
];

export const MOCK_REVENUE_MONTHS: RevenueMonth[] = [
  { month: "Jan", thisYear: 42000, prevYear: 31000 },
  { month: "Feb", thisYear: 38000, prevYear: 35000 },
  { month: "Mar", thisYear: 51000, prevYear: 40000 },
  { month: "Apr", thisYear: 45000, prevYear: 42000 },
  { month: "May", thisYear: 58000, prevYear: 44000 },
  { month: "Jun", thisYear: 46500, prevYear: 48000 },
];

const BASE_METRICS: Omit<MetricCard, "value" | "displayValue">[] = [
  {
    id: "product-revenue",
    label: "Product Revenue",
    suffix: undefined,
    changePercent: 20,
    changeAbsolute: 2423,
    direction: "up",
  },
  {
    id: "total-sales",
    label: "Total Sales Product",
    suffix: undefined,
    changePercent: 20,
    changeAbsolute: 84,
    direction: "up",
  },
  {
    id: "total-deals",
    label: "Total Deals",
    suffix: undefined,
    changePercent: -15,
    changeAbsolute: -134,
    direction: "down",
  },
  {
    id: "conversion",
    label: "Convo Rate",
    suffix: "%",
    changePercent: -12,
    changeAbsolute: 0,
    direction: "down",
  },
];

export function parseDateRange(
  raw: string | null,
): DateRangePreset {
  const allowed: DateRangePreset[] = ["7d", "30d", "3m", "6m", "ytd"];
  if (raw && allowed.includes(raw as DateRangePreset)) {
    return raw as DateRangePreset;
  }
  return "30d";
}

export function rangeStart(preset: DateRangePreset, now = new Date()): Date {
  switch (preset) {
    case "7d":
      return subDays(now, 7);
    case "30d":
      return subDays(now, 30);
    case "3m":
      return subMonths(now, 3);
    case "6m":
      return subMonths(now, 6);
    case "ytd":
      return startOfYear(now);
    default:
      return subDays(now, 30);
  }
}

/** Scale mock metrics slightly by selected range */
export function rangeMultiplier(preset: DateRangePreset): number {
  switch (preset) {
    case "7d":
      return 0.35;
    case "30d":
      return 1;
    case "3m":
      return 1.15;
    case "6m":
      return 1.25;
    case "ytd":
      return 1.4;
    default:
      return 1;
  }
}

export function filterDealsByCloseDate(
  deals: Deal[],
  preset: DateRangePreset,
  now = new Date(),
): Deal[] {
  const start = rangeStart(preset, now);
  const end = addDays(now, 365);
  return deals.filter((d) => {
    const t = new Date(d.expectedClose).getTime();
    return t >= start.getTime() && t <= end.getTime();
  });
}

export function buildMetricsWithJitter(preset: DateRangePreset): MetricCard[] {
  const mult = rangeMultiplier(preset);
  const jitter = () => 0.98 + Math.random() * 0.04;

  return BASE_METRICS.map((m) => {
    if (m.id === "product-revenue") {
      const base = 10312.1 * mult;
      const v = Math.round(base * jitter() * 100) / 100;
      return {
        ...m,
        value: v,
        displayValue: v.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }),
      };
    }
    if (m.id === "total-sales") {
      const v = Math.round(224 * mult * jitter());
      return { ...m, value: v };
    }
    if (m.id === "total-deals") {
      const v = Math.round(3612 * mult * jitter());
      return { ...m, value: v };
    }
    if (m.id === "conversion") {
      const v = Math.round(67 * jitter());
      return { ...m, value: v };
    }
    return { ...m, value: 0 };
  });
}

export function scaleLeadSources(
  preset: DateRangePreset,
): { slices: LeadSourceSlice[]; totalLeads: number } {
  const mult = rangeMultiplier(preset);
  const slices = MOCK_LEAD_SOURCES.map((s) => ({
    ...s,
    count: Math.max(1, Math.round(s.count * mult * (0.95 + Math.random() * 0.1))),
  }));
  const totalLeads = slices.reduce((a, s) => a + s.count, 0);
  return { slices, totalLeads };
}

export function scaleRevenue(preset: DateRangePreset): {
  months: RevenueMonth[];
  totalRevenue: number;
  bestMonth: string;
  bestMonthAmount: number;
} {
  const mult = rangeMultiplier(preset);
  const months = MOCK_REVENUE_MONTHS.map((m) => ({
    month: m.month,
    thisYear: Math.round(m.thisYear * mult * (0.97 + Math.random() * 0.06)),
    prevYear: Math.round(m.prevYear * mult * (0.97 + Math.random() * 0.06)),
  }));
  let bestMonth = months[0].month;
  let bestMonthAmount = months[0].thisYear;
  for (const m of months) {
    if (m.thisYear > bestMonthAmount) {
      bestMonthAmount = m.thisYear;
      bestMonth = m.month;
    }
  }
  const totalRevenue = months.reduce((a, m) => a + m.thisYear + m.prevYear, 0);
  return { months, totalRevenue, bestMonth, bestMonthAmount };
}
