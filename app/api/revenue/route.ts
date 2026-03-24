import { NextResponse } from "next/server";
import { parseDateRange, scaleRevenue } from "@/lib/mock-data";
import type { RevenueResponse } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const preset = parseDateRange(searchParams.get("dateRange"));
  const body: RevenueResponse = scaleRevenue(preset);
  return NextResponse.json(body);
}
