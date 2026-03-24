import { NextResponse } from "next/server";
import { buildMetricsWithJitter, parseDateRange } from "@/lib/mock-data";
import type { MetricsResponse } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const preset = parseDateRange(searchParams.get("dateRange"));
  const metrics = buildMetricsWithJitter(preset);
  const body: MetricsResponse = {
    metrics,
    updatedAt: new Date().toISOString(),
  };
  return NextResponse.json(body);
}
