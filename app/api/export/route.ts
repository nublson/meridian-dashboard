import { NextResponse } from "next/server";
import {
  buildMetricsWithJitter,
  filterDealsByCloseDate,
  MOCK_DEALS,
  parseDateRange,
  scaleLeadSources,
  scaleRevenue,
} from "@/lib/mock-data";
import type { ExportFormat } from "@/lib/types";

function csvEscape(s: string): string {
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const preset = parseDateRange(searchParams.get("dateRange"));
  const format = (searchParams.get("format") ?? "json") as ExportFormat;
  const q = searchParams.get("q")?.toLowerCase().trim();
  const stagesRaw = searchParams.get("stages");

  let deals = filterDealsByCloseDate(MOCK_DEALS, preset);
  if (q) {
    deals = deals.filter(
      (d) =>
        d.dealName.toLowerCase().includes(q) ||
        d.client.toLowerCase().includes(q),
    );
  }
  if (stagesRaw?.trim()) {
    const set = new Set(
      stagesRaw.split(",").map((s) => s.trim()).filter(Boolean),
    );
    deals = deals.filter((d) => set.has(d.stage));
  }

  const metrics = buildMetricsWithJitter(preset);
  const leads = scaleLeadSources(preset);
  const revenue = scaleRevenue(preset);

  const payload = {
    exportedAt: new Date().toISOString(),
    dateRange: preset,
    metrics,
    leadSources: leads,
    revenue,
    deals,
  };

  if (format === "csv") {
    const headers = [
      "id",
      "dealName",
      "client",
      "stage",
      "value",
      "owner",
      "expectedClose",
    ];
    const lines = [
      headers.join(","),
      ...deals.map((d) =>
        [
          d.id,
          d.dealName,
          d.client,
          d.stage,
          String(d.value),
          d.owner.name,
          d.expectedClose,
        ].map((c) => csvEscape(c)).join(","),
      ),
    ];
    const csv = lines.join("\n");
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="cliento-export-${preset}.csv"`,
      },
    });
  }

  return NextResponse.json(payload, {
    headers: {
      "Content-Disposition": `attachment; filename="cliento-export-${preset}.json"`,
    },
  });
}
