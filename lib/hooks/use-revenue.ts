"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { DateRangePreset, RevenueResponse } from "@/lib/types";

async function fetchRevenue(dateRange: DateRangePreset): Promise<RevenueResponse> {
  const res = await fetch(`/api/revenue?dateRange=${dateRange}`);
  if (!res.ok) throw new Error("Failed to load revenue");
  return res.json();
}

export function useRevenue(dateRange: DateRangePreset) {
  return useQuery({
    queryKey: ["revenue", dateRange],
    queryFn: () => fetchRevenue(dateRange),
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
}
