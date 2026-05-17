import type {
  SkeletonProps,
  TableSkeletonProps,
  FormSkeletonProps,
  ListPageSkeletonProps,
} from './Skeleton.types';

export const Skeleton = ({ className = '' }: SkeletonProps) => (
  <div className={`animate-pulse rounded bg-surface-raised ${className}`} />
);

export const DataCardsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="rounded-xl border border-border p-5 space-y-3">
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-3 w-24" />
      </div>
    ))}
  </div>
);

export const TableSkeleton = ({ rows = 6, cols = 5 }: TableSkeletonProps) => (
  <div>
    <div className="border-b border-border px-4 py-3 flex gap-4">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-3 flex-1 max-w-[80px]" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="border-b border-border px-4 py-4 flex gap-4">
        {Array.from({ length: cols }).map((_, j) => (
          <Skeleton key={j} className={`h-3.5 flex-1 ${j === 0 ? 'max-w-[60px]' : ''}`} />
        ))}
      </div>
    ))}
  </div>
);

export const FormSkeleton = ({ fields = 4 }: FormSkeletonProps) => (
  <div className="space-y-5">
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i} className="space-y-1.5">
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-9 w-full" />
      </div>
    ))}
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-1">
      <Skeleton className="h-7 w-36" />
      <Skeleton className="h-4 w-56" />
    </div>
    <DataCardsSkeleton />
    <div className="bg-surface rounded-2xl border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <Skeleton className="h-4 w-40" />
      </div>
      <TableSkeleton rows={5} cols={5} />
    </div>
  </div>
);

export const ListPageSkeleton = ({ cols = 5 }: ListPageSkeletonProps) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-9 w-32 rounded-lg" />
    </div>
    <div className="bg-surface rounded-2xl border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex gap-3">
        <Skeleton className="h-9 flex-1 rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
      <TableSkeleton rows={8} cols={cols} />
    </div>
  </div>
);
