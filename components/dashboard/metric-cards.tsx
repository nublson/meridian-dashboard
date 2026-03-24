"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { useMetrics } from "@/lib/hooks/use-metrics";
import type { DateRangePreset } from "@/lib/types";
import { formatCurrency, formatPercent, cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MetricCards({ dateRange }: { dateRange: DateRangePreset }) {
  const { data, isPending, isError } = useMetrics(dateRange);

  if (isError) {
    return (
      <div className="text-destructive text-sm">
        Could not load metrics. Try again shortly.
      </div>
    );
  }

  if (isPending || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-3 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {data.metrics.map((m) => {
        const isUp = m.direction === "up";
        const TrendIcon = isUp ? TrendingUp : TrendingDown;
        const display =
          m.displayValue ??
          (m.suffix === "%"
            ? formatPercent(Math.round(m.value))
            : m.id === "product-revenue"
              ? formatCurrency(m.value)
              : m.value.toLocaleString());
        const absPart =
          m.id === "product-revenue"
            ? formatCurrency(Math.abs(m.changeAbsolute))
            : Math.abs(m.changeAbsolute).toLocaleString();
        const changeLabel =
          m.suffix === "%"
            ? `${m.changePercent > 0 ? "+" : ""}${m.changePercent}% vs last month`
            : `${m.changePercent > 0 ? "+" : ""}${m.changePercent}% (${m.changeAbsolute >= 0 ? "+" : "-"}${absPart}) vs last month`;

        return (
          <Card key={m.id} className="relative overflow-hidden">
            <span
              className="bg-primary absolute top-3 right-3 size-2 rounded-full animate-live-pulse"
              aria-hidden
            />
            <CardHeader className="flex flex-col gap-1 pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {m.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-2xl font-semibold tracking-tight tabular-nums">
                {display}
              </p>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-1 pt-0">
              <p
                className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  isUp ? "text-success" : "text-destructive",
                )}
              >
                <TrendIcon />
                {changeLabel}
              </p>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
