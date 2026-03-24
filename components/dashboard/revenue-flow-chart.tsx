"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Trophy,
} from "lucide-react";
import { useRevenue } from "@/lib/hooks/use-revenue";
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

export function RevenueFlowChart({ dateRange }: { dateRange: DateRangePreset }) {
  const { data, isPending, isError } = useRevenue(dateRange);
  const [insightIndex, setInsightIndex] = React.useState(0);

  React.useEffect(() => {
    if (!data) return;
    const id = window.setInterval(() => {
      setInsightIndex((i) => (i + 1) % 3);
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

  if (isPending || !data) {
    return (
      <Card className="min-w-0 flex-1 lg:h-full">
        <CardHeader>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="aspect-video w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  const lastSixMonthsTotal = data.months.reduce((a, m) => a + m.thisYear, 0);

  const insights = [
    {
      title: "Total revenue (range)",
      body: `You generated ${formatCurrency(data.totalRevenue)} over the selected period.`,
    },
    {
      title: "Best performing month",
      body: `${data.bestMonth} is the highest revenue for the last 6 months with ${formatCurrency(data.bestMonthAmount)}.`,
    },
    {
      title: "Last 6 months",
      body: "Compare this year vs previous year by month in the chart below.",
    },
  ];
  const active = insights[insightIndex] ?? insights[0];

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
          <div className="flex w-full flex-col gap-4 lg:w-[280px] lg:shrink-0">
            <div>
              <p className="text-2xl font-bold tracking-tight tabular-nums">
                {formatCurrency(lastSixMonthsTotal)}
              </p>
              <CardDescription className="mt-1">
                Total Revenue (Last 6 Months)
              </CardDescription>
            </div>

            <div className="bg-muted/50 border-border flex gap-3 rounded-lg border p-3">
              <Trophy
                className="text-primary mt-0.5 size-5 shrink-0"
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                  {active.title}
                </p>
                <p className="mt-1 text-sm font-semibold leading-snug">
                  {active.body}
                </p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="size-8 shrink-0"
                    aria-label="Previous insight"
                    onClick={() =>
                      setInsightIndex(
                        (i) => (i - 1 + insights.length) % insights.length,
                      )
                    }
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <div className="flex flex-1 justify-center gap-1.5">
                    {insights.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        className={cn(
                          "size-2 rounded-full transition-colors",
                          i === insightIndex
                            ? "bg-primary"
                            : "bg-muted hover:bg-muted-foreground/40",
                        )}
                        aria-label={`Insight ${i + 1}`}
                        aria-current={i === insightIndex}
                        onClick={() => setInsightIndex(i)}
                      />
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="size-8 shrink-0"
                    aria-label="Next insight"
                    onClick={() =>
                      setInsightIndex((i) => (i + 1) % insights.length)
                    }
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
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
