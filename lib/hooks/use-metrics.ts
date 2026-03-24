"use client";

import { useQuery } from "@tanstack/react-query";
import type { DateRangePreset, MetricsResponse } from "@/lib/types";

async function fetchMetrics(dateRange: DateRangePreset): Promise<MetricsResponse> {
  const res = await fetch(`/api/metrics?dateRange=${dateRange}`);
  if (!res.ok) throw new Error("Failed to load metrics");
  return res.json();
}

export function useMetrics(dateRange: DateRangePreset) {
  return useQuery({
    queryKey: ["metrics", dateRange],
    queryFn: () => fetchMetrics(dateRange),
    refetchInterval: 30_000,
    staleTime: 15_000,
  });
}
