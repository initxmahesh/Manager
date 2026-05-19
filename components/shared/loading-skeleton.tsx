import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <Skeleton className="mb-2 h-4 w-24" />
      <Skeleton className="h-8 w-16" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b py-3">
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <Skeleton className="mb-2 h-3 w-20" />
      <Skeleton className="h-7 w-12" />
    </div>
  );
}
