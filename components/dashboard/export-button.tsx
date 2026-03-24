"use client";

import { Download } from "lucide-react";
import { toast } from "sonner";
import type { DateRangePreset } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function buildExportUrl(
  format: "csv" | "json",
  dateRange: DateRangePreset,
  q?: string,
  stages?: string[],
) {
  const sp = new URLSearchParams();
  sp.set("format", format);
  sp.set("dateRange", dateRange);
  if (q?.trim()) sp.set("q", q.trim());
  if (stages?.length) sp.set("stages", stages.join(","));
  return `/api/export?${sp.toString()}`;
}

async function downloadExport(url: string, filename: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Export failed");
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(objectUrl);
}

export function ExportReportButton({
  dateRange,
  searchQuery,
  stages,
}: {
  dateRange: DateRangePreset;
  searchQuery?: string;
  stages?: string[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm">
            <Download data-icon="inline-start" />
            Export
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={async () => {
              try {
                await downloadExport(
                  buildExportUrl("csv", dateRange, searchQuery, stages),
                  `cliento-export-${dateRange}.csv`,
                );
                toast.success("CSV export downloaded");
              } catch {
                toast.error("Export failed");
              }
            }}
          >
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={async () => {
              try {
                await downloadExport(
                  buildExportUrl("json", dateRange, searchQuery, stages),
                  `cliento-export-${dateRange}.json`,
                );
                toast.success("JSON export downloaded");
              } catch {
                toast.error("Export failed");
              }
            }}
          >
            Export as JSON
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
