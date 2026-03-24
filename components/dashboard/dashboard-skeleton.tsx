import { MetricCardsSkeleton } from "@/components/dashboard/metric-cards";
import {
  Card,
  CardContent,
  CardFooter,
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
          <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
            <Skeleton className="size-8 shrink-0 rounded-md" />
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
            <Skeleton className="mx-auto aspect-square w-full max-w-[200px] rounded-lg" />
            <div className="flex w-full flex-col gap-2 lg:min-w-[180px]">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-2.5 shrink-0 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-10" />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="text-muted-foreground border-0 bg-transparent py-3 text-xs">
            <Skeleton className="h-3 w-28" />
          </CardFooter>
        </Card>
        <Card className="flex min-w-0 flex-1 flex-col lg:h-full">
          <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0 pb-2">
            <Skeleton className="h-5 w-28" />
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-18" />
              <Skeleton className="size-8 shrink-0 rounded-md" />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-0">
            <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
              <div className="flex w-full flex-col justify-between gap-3 lg:w-[220px] lg:min-w-[220px] lg:shrink-0">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-36" />
                  <Skeleton className="h-3 w-44" />
                </div>
                <Skeleton className="box-border h-[137px] w-full rounded-lg border border-border" />
              </div>
              <div className="min-h-0 min-w-0 flex-1">
                <Skeleton className="h-56 w-full rounded-lg sm:h-60 lg:h-64" />
              </div>
            </div>
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
