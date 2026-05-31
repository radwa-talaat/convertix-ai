import { Skeleton } from "@/components/ui/skeleton";

export function ProjectGridLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          className="rounded-lg border border-border bg-card p-5 shadow-luxury-sm"
          key={index}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="size-8" />
          </div>
          <div className="mt-8 grid grid-cols-3 gap-3">
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
        </div>
      ))}
    </div>
  );
}
