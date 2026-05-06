import { cn } from "@/lib/utils";

/**
 * Loading skeleton with shimmer. Use as a placeholder while async data loads.
 */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("skeleton-shimmer rounded-2xl", className)} />;
}

export function ServiceCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-6">
      <Skeleton className="h-11 w-11 rounded-2xl" />
      <Skeleton className="mt-5 h-5 w-3/4" />
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-1 h-4 w-5/6" />
      <Skeleton className="mt-5 h-4 w-24" />
    </div>
  );
}
