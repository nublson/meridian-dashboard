import { NextResponse } from "next/server";
import { parseDateRange, scaleLeadSources } from "@/lib/mock-data";
import type { LeadSourcesResponse } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const preset = parseDateRange(searchParams.get("dateRange"));
  const { slices, totalLeads } = scaleLeadSources(preset);
  const body: LeadSourcesResponse = { slices, totalLeads };
  return NextResponse.json(body);
}
