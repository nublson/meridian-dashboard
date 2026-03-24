import type { DateRangePreset } from "@/lib/types";

export function buildExportUrl(
  format: "csv" | "json",
  dateRange: DateRangePreset,
  q?: string,
  stages?: string[],
): string {
  const sp = new URLSearchParams();
  sp.set("format", format);
  sp.set("dateRange", dateRange);
  if (q?.trim()) sp.set("q", q.trim());
  if (stages?.length) sp.set("stages", stages.join(","));
  return `/api/export?${sp.toString()}`;
}
