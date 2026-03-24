"use client";

import { Download } from "lucide-react";
import { toast } from "sonner";
import { buildExportUrl } from "@/lib/export-url";
import { Button } from "@/components/ui/button";
import type { DateRangePreset } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
                  `meridian-export-${dateRange}.csv`,
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
                  `meridian-export-${dateRange}.json`,
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
