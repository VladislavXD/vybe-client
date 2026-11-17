import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface TrackSkeletonProps {
  count?: number;
  className?: string;
}

/**
 * Скелетон загрузки треков, повторяющий точную геометрию карточки TrackCard.
 */
export const TrackSkeleton: React.FC<TrackSkeletonProps> = ({ count = 6, className }) => {
  return (
    <div className={cn('flex flex-col gap-2 w-full', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="w-full flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-2xl bg-[#141415]/50 border border-white/[0.05] animate-pulse"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Skeleton className="size-11 sm:size-12 rounded-xl shrink-0 bg-white/5" />
            <div className="flex flex-col gap-1.5 flex-1 min-w-0 pr-2">
              <Skeleton className="h-4 w-3/4 rounded bg-white/10" />
              <Skeleton className="h-3 w-1/2 rounded bg-white/5" />
            </div>
          </div>
          <Skeleton className="size-8 rounded-full shrink-0 bg-white/5" />
        </div>
      ))}
    </div>
  );
};
