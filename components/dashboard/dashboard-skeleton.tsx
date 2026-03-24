import { MetricCardsSkeleton } from "@/components/dashboard/metric-cards";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-9 w-64 max-w-full sm:w-72" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <Skeleton className="h-8 w-[160px] md:w-[180px]" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>

      <MetricCardsSkeleton />

      <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-stretch">
        <Card className="flex w-full flex-col lg:h-full lg:w-[410px]">
          <CardHeader className="flex flex-col gap-1 space-y-0">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent>
            <Skeleton className="aspect-video w-full rounded-lg" />
          </CardContent>
        </Card>
        <Card className="flex min-w-0 flex-1 flex-col lg:h-full">
          <CardHeader className="flex flex-col gap-1 space-y-0">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-64 max-w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="aspect-video w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-7 w-48" />
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-9 min-w-[200px] flex-1 sm:max-w-xs" />
            <Skeleton className="h-8 w-18" />
            <Skeleton className="h-8 w-18" />
          </div>
        </div>

        <div className="border-border overflow-x-auto rounded-lg border">
          <div className="bg-muted/30 flex min-w-[640px] gap-2 border-b px-3 py-3 sm:gap-3">
            <Skeleton className="h-4 w-6 shrink-0" />
            <Skeleton className="h-4 min-w-0 flex-1" />
            <Skeleton className="h-4 w-16 shrink-0 sm:w-20" />
            <Skeleton className="h-4 w-14 shrink-0 sm:w-16" />
            <Skeleton className="h-4 w-12 shrink-0 sm:w-14" />
            <Skeleton className="h-4 w-14 shrink-0 sm:w-16" />
            <Skeleton className="h-4 w-20 shrink-0 sm:w-24" />
            <Skeleton className="h-4 w-8 shrink-0" />
          </div>
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="flex min-w-[640px] gap-2 border-b px-3 py-2.5 last:border-b-0 sm:gap-3"
            >
              <Skeleton className="h-4 w-6 shrink-0 self-center" />
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <Skeleton className="size-8 shrink-0 rounded-full" />
                <Skeleton className="h-4 w-full max-w-[200px]" />
              </div>
              <Skeleton className="h-4 w-16 shrink-0 self-center sm:w-20" />
              <Skeleton className="h-6 w-14 shrink-0 self-center rounded-md sm:w-20" />
              <Skeleton className="h-4 w-12 shrink-0 self-center sm:w-14" />
              <Skeleton className="h-4 w-14 shrink-0 self-center sm:w-16" />
              <Skeleton className="h-4 w-20 shrink-0 self-center sm:w-24" />
              <Skeleton className="h-8 w-8 shrink-0 self-center" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
