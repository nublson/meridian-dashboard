"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useRevenue } from "@/lib/hooks/use-revenue";
import { DATE_RANGE_LABELS } from "@/lib/date-range-labels";
import type { DateRangePreset } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const chartConfig = {
  thisYear: {
    label: "This year",
    color: "var(--chart-3)",
  },
  prevYear: {
    label: "Prev year",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

const INSIGHT_TITLE = "Best Performing Month";
const INSIGHT_COUNT = 4;
/** Fixed layout so the insight card never shifts with copy or viewport. */
const INSIGHT_CARD_W_CLASS = "w-full lg:w-[220px] min-w-[220px]";
const INSIGHT_CARD_H_CLASS = "h-[137px]";

function buildInsightDescriptions(
  data: {
    months: { month: string; thisYear: number; prevYear: number }[];
    bestMonth: string;
    bestMonthAmount: number;
  },
  periodLabel: string,
): string[] {
  const { months, bestMonth, bestMonthAmount } = data;

  let topGrowthMonth = months[0];
  let topGrowthRatio = -Infinity;
  for (const m of months) {
    if (m.prevYear <= 0) continue;
    const ratio = (m.thisYear - m.prevYear) / m.prevYear;
    if (ratio > topGrowthRatio) {
      topGrowthRatio = ratio;
      topGrowthMonth = m;
    }
  }
  const growthPct =
    topGrowthRatio > -Infinity && topGrowthRatio !== Infinity
      ? Math.round(topGrowthRatio * 100)
      : 0;

  const sumThis = months.reduce((a, m) => a + m.thisYear, 0);
  const sumPrev = months.reduce((a, m) => a + m.prevYear, 0);
  const periodDeltaPct =
    sumPrev > 0 ? Math.round(((sumThis - sumPrev) / sumPrev) * 100) : 0;
  const periodTrend =
    periodDeltaPct === 0
      ? "flat year over year"
      : periodDeltaPct > 0
        ? `up ${periodDeltaPct}% year over year`
        : `down ${Math.abs(periodDeltaPct)}% year over year`;

  return [
    `${bestMonth} led revenue at ${formatCurrency(bestMonthAmount)} for ${periodLabel}.`,
    growthPct > 0
      ? `${topGrowthMonth.month} shows strong growth compared to previous year — ${growthPct}% YoY.`
      : `${topGrowthMonth.month} leads recent momentum compared to previous year.`,
    "Consistent revenue increase throughout the period.",
    `Period total: ${formatCurrency(sumThis)} — ${periodTrend}.`,
  ];
}

export function RevenueFlowChart({
  dateRange,
}: {
  dateRange: DateRangePreset;
}) {
  const { data, isError, isPlaceholderData } = useRevenue(dateRange);
  const [insightIndex, setInsightIndex] = React.useState(0);
  const [committedRange, setCommittedRange] =
    React.useState<DateRangePreset>(dateRange);

  React.useLayoutEffect(() => {
    if (!isPlaceholderData && data !== undefined) {
      setCommittedRange(dateRange);
    }
  }, [isPlaceholderData, data, dateRange]);

  /** Matches copy and totals to the series on screen (avoids label/chart mismatch while refetching). */
  const displayRange = isPlaceholderData ? committedRange : dateRange;

  const insightDescriptions = React.useMemo(
    () =>
      data
        ? buildInsightDescriptions(data, DATE_RANGE_LABELS[displayRange])
        : [],
    [data, displayRange],
  );

  React.useEffect(() => {
    if (!data) return;
    const id = window.setInterval(() => {
      setInsightIndex((i) => (i + 1) % INSIGHT_COUNT);
    }, 5000);
    return () => window.clearInterval(id);
  }, [data]);

  if (isError) {
    return (
      <Card className="min-w-0 flex-1 lg:h-full">
        <CardHeader>
          <CardTitle>Revenue Flow</CardTitle>
          <CardDescription>Could not load revenue data.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="min-w-0 flex-1 lg:h-full">
        <CardHeader>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-56 w-full shrink-0 rounded-lg sm:h-60 lg:h-64" />
        </CardContent>
      </Card>
    );
  }

  const periodTotal = data.months.reduce((a, m) => a + m.thisYear, 0);

  const activeDescription =
    insightDescriptions[insightIndex] ?? insightDescriptions[0] ?? "";

  return (
    <Card className="flex min-w-0 flex-1 flex-col lg:h-full">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Revenue Flow</CardTitle>
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <div className="text-muted-foreground flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: "var(--chart-3)" }}
                aria-hidden
              />
              This Year
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: "var(--chart-4)" }}
                aria-hidden
              />
              Prev Year
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground size-8"
                  aria-label="Revenue chart options"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                onSelect={() =>
                  toast.message("Chart options", {
                    description: "This is a demo dashboard.",
                  })
                }
              >
                View details
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() =>
                  toast.message("Export", {
                    description: "Use Export in the header for full reports.",
                  })
                }
              >
                Export chart
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-0">
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
          <div
            className={cn(
              "flex flex-col justify-between gap-3 lg:shrink-0",
              INSIGHT_CARD_W_CLASS,
            )}
          >
            <div>
              <p className="text-xl font-bold tracking-tight tabular-nums">
                {formatCurrency(periodTotal)}
              </p>
              <CardDescription className="mt-0.5 text-xs">
                Total revenue — {DATE_RANGE_LABELS[displayRange]}
              </CardDescription>
            </div>

            <div
              className={cn(
                "bg-muted/50 border-border box-border flex shrink-0 flex-col gap-1.5 rounded-lg border px-2 py-3",
                INSIGHT_CARD_W_CLASS,
                INSIGHT_CARD_H_CLASS,
              )}
            >
              <div className="flex shrink-0 items-center gap-1.5">
                <span className="text-sm leading-none" aria-hidden>
                  🏆
                </span>
                <p className="text-foreground line-clamp-1 text-[14px] font-semibold leading-tight">
                  {INSIGHT_TITLE}
                </p>
              </div>
              <p
                className="text-muted-foreground line-clamp-4 min-h-0 flex-1 text-[12px] leading-snug"
                aria-live="polite"
              >
                {activeDescription}
              </p>
              <div className="flex shrink-0 items-center justify-between gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground size-6 shrink-0 p-0"
                  aria-label="Previous insight"
                  onClick={() =>
                    setInsightIndex(
                      (i) => (i - 1 + INSIGHT_COUNT) % INSIGHT_COUNT,
                    )
                  }
                >
                  <ChevronLeft className="size-3" />
                </Button>
                <div className="flex min-w-0 flex-1 items-center justify-center gap-1 px-0.5">
                  {insightDescriptions.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={cn(
                        "h-0.5 min-w-0 flex-1 rounded-full transition-[height,background-color]",
                        i === insightIndex
                          ? "bg-foreground h-1"
                          : "bg-muted-foreground/35 hover:bg-muted-foreground/55",
                      )}
                      aria-label={`Insight ${i + 1} of ${insightDescriptions.length}`}
                      aria-current={i === insightIndex}
                      onClick={() => setInsightIndex(i)}
                    />
                  ))}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground size-6 shrink-0 p-0"
                  aria-label="Next insight"
                  onClick={() =>
                    setInsightIndex((i) => (i + 1) % INSIGHT_COUNT)
                  }
                >
                  <ChevronRight className="size-3" />
                </Button>
              </div>
            </div>
          </div>

          <div className="min-h-0 min-w-0 flex-1">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-56 w-full sm:h-60 lg:h-64"
            >
              <BarChart
                data={data.months}
                margin={{ left: 4, right: 8, top: 8, bottom: 4 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(v) => `$${Number(v) / 1000}k`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="thisYear"
                  fill="var(--color-thisYear)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
                <Bar
                  dataKey="prevYear"
                  fill="var(--color-prevYear)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
