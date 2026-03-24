"use client";

import type { LucideIcon } from "lucide-react";
import {
  BarChart2,
  MessageCircle,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
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

const METRIC_ICONS: Record<string, LucideIcon> = {
  "product-revenue": BarChart2,
  "total-sales": ShoppingBag,
  "total-deals": Users,
  conversion: MessageCircle,
};

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
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
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
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
      {data.metrics.map((m) => {
        const MetricIcon = METRIC_ICONS[m.id] ?? BarChart2;
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
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
              <MetricIcon
                className="text-muted-foreground size-4 shrink-0"
                aria-hidden
              />
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
