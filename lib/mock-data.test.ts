import { addDays, startOfYear, subDays, subMonths } from "date-fns";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Deal } from "@/lib/types";
import {
  buildDeals,
  buildMetricsWithJitter,
  filterDealsByCloseDate,
  parseDateRange,
  rangeMultiplier,
  rangeStart,
  scaleLeadSources,
  scaleRevenue,
} from "./mock-data";

const fixedNow = new Date("2024-06-15T12:00:00.000Z");

describe("parseDateRange", () => {
  it("defaults to 30d for null or invalid", () => {
    expect(parseDateRange(null)).toBe("30d");
    expect(parseDateRange("")).toBe("30d");
    expect(parseDateRange("invalid")).toBe("30d");
  });

  it("accepts allowed presets", () => {
    expect(parseDateRange("7d")).toBe("7d");
    expect(parseDateRange("ytd")).toBe("ytd");
  });
});

describe("rangeStart", () => {
  it("matches date-fns for each preset (timezone-stable)", () => {
    expect(rangeStart("7d", fixedNow).getTime()).toBe(subDays(fixedNow, 7).getTime());
    expect(rangeStart("30d", fixedNow).getTime()).toBe(subDays(fixedNow, 30).getTime());
    expect(rangeStart("3m", fixedNow).getTime()).toBe(subMonths(fixedNow, 3).getTime());
    expect(rangeStart("6m", fixedNow).getTime()).toBe(subMonths(fixedNow, 6).getTime());
    expect(rangeStart("ytd", fixedNow).getTime()).toBe(startOfYear(fixedNow).getTime());
  });
});

describe("rangeMultiplier", () => {
  it("returns multipliers per preset", () => {
    expect(rangeMultiplier("7d")).toBe(0.35);
    expect(rangeMultiplier("30d")).toBe(1);
    expect(rangeMultiplier("3m")).toBe(1.15);
    expect(rangeMultiplier("6m")).toBe(1.25);
    expect(rangeMultiplier("ytd")).toBe(1.4);
  });
});

describe("buildDeals", () => {
  it("returns 50 deals with stable ids", () => {
    const deals = buildDeals();
    expect(deals).toHaveLength(50);
    expect(deals[0].id).toBe("deal-1");
    expect(deals[49].id).toBe("deal-50");
    expect(buildDeals()[0].dealName).toBe(deals[0].dealName);
  });
});

describe("filterDealsByCloseDate", () => {
  const start = rangeStart("30d", fixedNow);
  const inside: Deal = {
    id: "d1",
    dealName: "X",
    client: "Y",
    stage: "Qualified",
    value: 1,
    owner: { name: "A", initials: "A" },
    expectedClose: addDays(start, 1).toISOString(),
    dealInitials: "XY",
  };
  const tooEarly: Deal = {
    ...inside,
    id: "d2",
    expectedClose: addDays(start, -1).toISOString(),
  };
  const withinHorizon: Deal = {
    ...inside,
    id: "d3",
    expectedClose: addDays(fixedNow, 200).toISOString(),
  };

  it("keeps deals in [rangeStart, now+365]", () => {
    const out = filterDealsByCloseDate([inside, tooEarly, withinHorizon], "30d", fixedNow);
    expect(out.map((d) => d.id).sort()).toEqual(["d1", "d3"]);
  });
});

describe("buildMetricsWithJitter / scaleLeadSources / scaleRevenue", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("buildMetricsWithJitter returns four metrics with stable structure when random fixed", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const metrics = buildMetricsWithJitter("30d");
    expect(metrics).toHaveLength(4);
    expect(metrics.map((m) => m.id)).toEqual([
      "product-revenue",
      "total-sales",
      "total-deals",
      "conversion",
    ]);
    expect(metrics.every((m) => typeof m.value === "number")).toBe(true);
  });

  it("scaleLeadSources totalLeads equals sum of slice counts", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const { slices, totalLeads } = scaleLeadSources("30d");
    expect(totalLeads).toBe(slices.reduce((a, s) => a + s.count, 0));
    expect(slices.every((s) => s.count >= 1)).toBe(true);
  });

  it("scaleRevenue returns months and consistent best month fields", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const r = scaleRevenue("30d");
    expect(r.months).toHaveLength(6);
    const maxThisYear = Math.max(...r.months.map((m) => m.thisYear));
    expect(r.bestMonthAmount).toBe(maxThisYear);
    expect(r.months.find((m) => m.month === r.bestMonth)?.thisYear).toBe(maxThisYear);
  });
});
