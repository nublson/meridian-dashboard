import { NextResponse } from "next/server";
import {
  filterDealsByCloseDate,
  MOCK_DEALS,
  parseDateRange,
} from "@/lib/mock-data";
import type { Deal, DealStage, DealsResponse } from "@/lib/types";

function parseStages(raw: string | null): DealStage[] | null {
  if (!raw?.trim()) return null;
  const allowed: DealStage[] = [
    "Negotiation",
    "Proposal Sent",
    "Qualified",
    "Discovery",
  ];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s): s is DealStage => allowed.includes(s as DealStage));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const preset = parseDateRange(searchParams.get("dateRange"));
  let rows = filterDealsByCloseDate(MOCK_DEALS, preset);

  const q = searchParams.get("q")?.toLowerCase().trim();
  if (q) {
    rows = rows.filter(
      (d) =>
        d.dealName.toLowerCase().includes(q) ||
        d.client.toLowerCase().includes(q),
    );
  }

  const stages = parseStages(searchParams.get("stages"));
  if (stages?.length) {
    rows = rows.filter((d) => stages.includes(d.stage));
  }

  const sortBy = searchParams.get("sortBy") ?? "expectedClose";
  const sortDir = searchParams.get("sortDir") === "asc" ? "asc" : "desc";
  rows = [...rows].sort((a, b) => {
    let cmp = 0;
    if (sortBy === "value") {
      cmp = a.value - b.value;
    } else {
      cmp =
        new Date(a.expectedClose).getTime() -
        new Date(b.expectedClose).getTime();
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.min(
    50,
    Math.max(5, Number(searchParams.get("pageSize")) || 10),
  );
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const deals: Deal[] = rows.slice(start, start + pageSize);

  const body: DealsResponse = {
    deals,
    total,
    page,
    pageSize,
    totalPages,
  };
  return NextResponse.json(body);
}
