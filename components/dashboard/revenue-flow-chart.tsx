"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { useRevenue } from "@/lib/hooks/use-revenue";
import type { DateRangePreset } from "@/lib/types";
import { formatCompactCurrency } from "@/lib/utils";
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
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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
      <Card>
        <CardHeader>
          <CardTitle>Revenue flow</CardTitle>
          <CardDescription>Could not load revenue data.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isPending || !data) {
    return (
      <Card>
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

  const insights = [
    {
      title: "Total revenue (range)",
      body: formatCompactCurrency(data.totalRevenue),
    },
    {
      title: "Best performing month",
      body: `${data.bestMonth} · ${formatCompactCurrency(data.bestMonthAmount)}`,
    },
    {
      title: "Last 6 months",
      body: "Compare this year vs previous year by month.",
    },
  ];
  const active = insights[insightIndex] ?? insights[0];

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-col gap-2">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>Revenue flow</CardTitle>
            <CardDescription>
              Total revenue (last 6 months):{" "}
              {formatCompactCurrency(
                data.months.reduce((a, m) => a + m.thisYear, 0),
              )}
            </CardDescription>
          </div>
          <div className="bg-muted/50 border-border flex max-w-sm flex-col gap-1 rounded-lg border p-3 text-sm">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              {active.title}
            </p>
            <p className="font-semibold">{active.body}</p>
            <div className="mt-1 flex gap-1.5">
              {insights.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={cn(
                    "size-2 rounded-full transition-colors",
                    i === insightIndex ? "bg-primary" : "bg-muted hover:bg-muted-foreground/40",
                  )}
                  aria-label={`Insight ${i + 1}`}
                  aria-current={i === insightIndex}
                  onClick={() => setInsightIndex(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={chartConfig} className="aspect-video w-full">
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
      </CardContent>
    </Card>
  );
}
