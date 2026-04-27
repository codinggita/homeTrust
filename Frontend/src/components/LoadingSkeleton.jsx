import { cn } from "@/lib/utils";

export function Skeleton({ className }) {
  return (
    <div className={cn("animate-pulse rounded-md bg-muted/70", className)} />
  );
}

export function CardGridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3 rounded-xl border border-border p-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-6 w-24" />
        </div>
      ))}
    </div>
  );
}
