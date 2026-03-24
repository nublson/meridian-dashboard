import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
      <div className="bg-card rounded-xl border p-4 sm:p-6">
        <div className="flex flex-col gap-0 xl:flex-row">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="relative flex-1 space-y-3 p-4 sm:p-6 xl:py-4"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 shrink-0 rounded-lg" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-3 w-full max-w-[200px]" />
              {i < 3 && (
                <div
                  className="bg-border absolute right-0 bottom-0 left-0 h-px xl:top-4 xl:right-0 xl:bottom-4 xl:left-auto xl:h-auto xl:w-px"
                  aria-hidden
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:gap-6 xl:flex-row">
        <Skeleton className="aspect-[4/3] w-full rounded-xl xl:max-w-[410px]" />
        <Skeleton className="aspect-[4/3] min-w-0 flex-1 rounded-xl" />
      </div>
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  );
}
