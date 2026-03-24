"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { parseDateRange } from "@/lib/mock-data";
import type { DateRangePreset, DealStage } from "@/lib/types";
import { ActiveDealsTable } from "@/components/dashboard/active-deals-table";
import { LeadSourcesChart } from "@/components/dashboard/lead-sources-chart";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { RevenueFlowChart } from "@/components/dashboard/revenue-flow-chart";
import { WelcomeSection } from "@/components/dashboard/welcome-section";

export function DashboardView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dateRange = parseDateRange(searchParams.get("range"));

  const [exportCtx, setExportCtx] = React.useState<{
    q: string;
    stages: DealStage[];
  }>({ q: "", stages: [] });

  const setDateRange = React.useCallback(
    (next: DateRangePreset) => {
      const p = new URLSearchParams(searchParams.toString());
      p.set("range", next);
      router.push(`${pathname}?${p.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const handleExportCtx = React.useCallback(
    (ctx: { q: string; stages: DealStage[] }) => {
      setExportCtx(ctx);
    },
    [],
  );

  React.useEffect(() => {
    if (searchParams.get("range")) return;
    const p = new URLSearchParams(searchParams.toString());
    p.set("range", "30d");
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  return (
    <div className="flex flex-col gap-6">
      <WelcomeSection
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        exportQuery={exportCtx.q}
        exportStages={exportCtx.stages}
      />
      <MetricCards dateRange={dateRange} />
      <div className="grid gap-4 lg:grid-cols-2">
        <LeadSourcesChart dateRange={dateRange} />
        <RevenueFlowChart dateRange={dateRange} />
      </div>
      <ActiveDealsTable
        dateRange={dateRange}
        onExportContextChange={handleExportCtx}
      />
    </div>
  );
}
