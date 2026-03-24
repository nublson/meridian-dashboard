"use client";

import * as React from "react";
import { MoreHorizontal } from "lucide-react";
import { Pie, PieChart, Cell, Label } from "recharts";
import { toast } from "sonner";
import { useLeadSources } from "@/lib/hooks/use-lead-sources";
import type { DateRangePreset } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    <Card className="flex w-full flex-col xl:w-[410px]">
      <CardHeader>
        <div className="flex flex-col gap-1">
          <CardTitle>Lead Sources</CardTitle>
          <CardDescription>Distribution by channel</CardDescription>
        </div>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground size-8"
                  aria-label="Lead sources chart options"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                onSelect={() =>
                  toast.message("Lead sources", {
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
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[200px]"
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
              innerRadius={55}
              outerRadius={80}
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
                          className="fill-foreground text-lg font-bold"
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
      <CardFooter className="text-muted-foreground border-0 bg-transparent py-3 text-xs">
        Last 30 days
      </CardFooter>
    </Card>
  );
}
