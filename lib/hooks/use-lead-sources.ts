"use client";

import { useQuery } from "@tanstack/react-query";
import type { DateRangePreset, LeadSourcesResponse } from "@/lib/types";

async function fetchLeadSources(
  dateRange: DateRangePreset,
): Promise<LeadSourcesResponse> {
  const res = await fetch(`/api/lead-sources?dateRange=${dateRange}`);
  if (!res.ok) throw new Error("Failed to load lead sources");
  return res.json();
}

export function useLeadSources(dateRange: DateRangePreset) {
  return useQuery({
    queryKey: ["lead-sources", dateRange],
    queryFn: () => fetchLeadSources(dateRange),
    staleTime: 60_000,
    placeholderData: (previousData) => previousData,
  });
}
