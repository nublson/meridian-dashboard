"use client";

import { Plus } from "lucide-react";
import type { DateRangePreset } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { DateRangeFilter } from "@/components/dashboard/date-range-filter";
import { ExportReportButton } from "@/components/dashboard/export-button";

export function WelcomeSection({
  dateRange,
  onDateRangeChange,
  exportQuery,
  exportStages,
}: {
  dateRange: DateRangePreset;
  onDateRangeChange: (v: DateRangePreset) => void;
  exportQuery?: string;
  exportStages?: string[];
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Welcome Back, John!
        </h2>
        <p className="text-muted-foreground text-sm">
          Today you have 3 new leads, 2 follow-ups due.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 md:justify-end">
        <DateRangeFilter value={dateRange} onChange={onDateRangeChange} />
        <ExportReportButton
          dateRange={dateRange}
          searchQuery={exportQuery}
          stages={exportStages}
        />
        <Button size="sm">
          <Plus data-icon="inline-start" />
          New
        </Button>
      </div>
    </div>
  );
}
