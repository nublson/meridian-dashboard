"use client";

import { useQuery } from "@tanstack/react-query";
import type { DateRangePreset, DealsResponse } from "@/lib/types";

export interface DealsQueryParams {
  dateRange: DateRangePreset;
  q?: string;
  stages?: string[];
  page: number;
  pageSize: number;
  sortBy: "value" | "expectedClose";
  sortDir: "asc" | "desc";
}

function buildDealsUrl(p: DealsQueryParams): string {
  const sp = new URLSearchParams();
  sp.set("dateRange", p.dateRange);
  if (p.q?.trim()) sp.set("q", p.q.trim());
  if (p.stages?.length) sp.set("stages", p.stages.join(","));
  sp.set("page", String(p.page));
  sp.set("pageSize", String(p.pageSize));
  sp.set("sortBy", p.sortBy);
  sp.set("sortDir", p.sortDir);
  return `/api/deals?${sp.toString()}`;
}

async function fetchDeals(p: DealsQueryParams): Promise<DealsResponse> {
  const res = await fetch(buildDealsUrl(p));
  if (!res.ok) throw new Error("Failed to load deals");
  return res.json();
}

export function useDeals(params: DealsQueryParams) {
  return useQuery({
    queryKey: [
      "deals",
      params.dateRange,
      params.q ?? "",
      (params.stages ?? []).slice().sort().join("|"),
      params.page,
      params.pageSize,
      params.sortBy,
      params.sortDir,
    ],
    queryFn: () => fetchDeals(params),
    placeholderData: (prev) => prev,
  });
}
