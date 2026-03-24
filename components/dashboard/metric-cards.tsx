"use client";

import type { LucideIcon } from "lucide-react";
import {
  Coins,
  MessageCircle,
  Package,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMetrics } from "@/lib/hooks/use-metrics";
import type { DateRangePreset } from "@/lib/types";
import { formatCurrency, formatPercent, cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const METRIC_ICONS: Record<string, LucideIcon> = {
  "product-revenue": Coins,
  "total-sales": Package,
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
      <div className="bg-card rounded-xl border">
        <div className="flex flex-col gap-0 lg:flex-row">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="relative flex-1 space-y-3 p-4 sm:p-6 lg:py-4"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 shrink-0 rounded-lg" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-3 w-full max-w-[200px]" />
              {i < 3 && (
                <div
                  className="bg-border absolute right-0 bottom-0 left-0 h-px lg:top-4 lg:right-0 lg:bottom-4 lg:left-auto lg:h-auto lg:w-px"
                  aria-hidden
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const metrics = data.metrics;

  return (
    <div className="bg-card rounded-xl border">
      <div className="flex flex-col lg:flex-row">
        {metrics.map((m, index) => {
          const MetricIcon = METRIC_ICONS[m.id] ?? Coins;
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
          const percentStr = `${m.changePercent > 0 ? "+" : ""}${m.changePercent}%`;
          const absParen =
            m.suffix === "%" ? null : `(${absPart})`;

          return (
            <div
              key={m.id}
              className="relative flex-1 p-4 sm:p-6 lg:py-4"
            >
              <span
                className="bg-primary absolute top-4 right-4 size-2 rounded-full animate-live-pulse sm:top-6 sm:right-6 lg:top-5 lg:right-5"
                aria-hidden
              />
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg p-2">
                  <MetricIcon className="size-5" aria-hidden />
                </div>
                <p className="text-muted-foreground text-sm font-medium">
                  {m.label}
                </p>
              </div>
              <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">
                {display}
              </p>
              <div className="mt-2 space-y-0.5">
                <p className="flex flex-wrap items-center gap-1 text-xs font-medium">
                  <TrendIcon
                    className={cn(
                      "size-3.5 shrink-0",
                      isUp ? "text-success" : "text-destructive",
                    )}
                  />
                  <span
                    className={isUp ? "text-success" : "text-destructive"}
                  >
                    {percentStr}
                  </span>
                  {absParen !== null && (
                    <span className="text-muted-foreground font-normal">
                      {absParen}
                    </span>
                  )}
                </p>
                <p className="text-muted-foreground text-xs">vs last month</p>
              </div>
              {index < metrics.length - 1 && (
                <div
                  className="bg-border absolute right-0 bottom-0 left-0 h-px lg:top-4 lg:right-0 lg:bottom-4 lg:left-auto lg:h-auto lg:w-px"
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
