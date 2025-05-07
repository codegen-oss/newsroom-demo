'use client';

import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';

export default function ArticleCardSkeleton() {
  return (
    <Card className="h-full flex flex-col" animate={false}>
      {/* Image skeleton */}
      <Skeleton 
        variant="rectangular" 
        className="h-48 w-full" 
      />

      {/* Content */}
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex items-center mb-2 space-x-4">
          <Skeleton variant="text" width={80} />
          <Skeleton variant="text" width={100} />
        </div>

        <Skeleton variant="text" className="h-7 mb-2" />
        <Skeleton variant="text" className="h-4 mb-1" />
        <Skeleton variant="text" className="h-4 mb-1" />
        <Skeleton variant="text" className="h-4 mb-4 w-3/4" />

        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-4">
          <Skeleton variant="rectangular" className="h-6 w-16 rounded-full" />
          <Skeleton variant="rectangular" className="h-6 w-20 rounded-full" />
          <Skeleton variant="rectangular" className="h-6 w-14 rounded-full" />
        </div>

        <Skeleton variant="rectangular" className="h-10 w-full rounded-md" />
      </div>
    </Card>
  );
}

