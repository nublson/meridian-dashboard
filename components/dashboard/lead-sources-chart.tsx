"use client";

import * as React from "react";
import { Pie, PieChart, Cell, Label } from "recharts";
import { useLeadSources } from "@/lib/hooks/use-lead-sources";
import type { DateRangePreset } from "@/lib/types";
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

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
] as const;

function slugSource(source: string) {
  return source.toLowerCase().replace(/\s+/g, "_");
}

export function LeadSourcesChart({ dateRange }: { dateRange: DateRangePreset }) {
  const { data, isPending, isError } = useLeadSources(dateRange);

  const chartData = React.useMemo(() => {
    if (!data) return [];
    return data.slices.map((s, i) => ({
      ...s,
      key: slugSource(s.source),
      fill: COLORS[i % COLORS.length],
    }));
  }, [data]);

  const chartConfig = React.useMemo(() => {
    const c: ChartConfig = {};
    data?.slices.forEach((s, i) => {
      c[slugSource(s.source)] = {
        label: s.source,
        color: COLORS[i % COLORS.length],
      };
    });
    return c;
  }, [data]);

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lead Sources</CardTitle>
          <CardDescription>Could not load chart data.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isPending || !data) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <Skeleton className="aspect-video w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-col gap-1">
        <CardTitle>Lead Sources</CardTitle>
        <CardDescription>Distribution by channel</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[280px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="key"
              innerRadius={68}
              outerRadius={96}
              strokeWidth={2}
              stroke="var(--background)"
            >
              {chartData.map((entry) => (
                <Cell key={entry.source} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) - 8}
                          className="fill-foreground text-xl font-bold"
                        >
                          {data.totalLeads.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 14}
                          className="fill-muted-foreground text-xs"
                        >
                          Total Leads
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <ul className="flex flex-col gap-2 text-sm lg:min-w-[180px]">
          {data.slices.map((s, i) => (
            <li
              key={s.source}
              className="flex items-center justify-between gap-4"
            >
              <span className="flex items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-muted-foreground">{s.source}</span>
              </span>
              <span className="font-medium tabular-nums">
                {s.count.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
