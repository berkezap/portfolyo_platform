interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  animation?: 'pulse' | 'wave' | 'none';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  animation = 'pulse',
  width,
  height,
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200';

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded',
    rounded: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-wave',
    none: '',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  const classes = [
    baseClasses,
    variantClasses[variant],
    animationClasses[animation],
    className,
  ].join(' ');

  return <div className={classes} style={style} />;
}

// Repository Card Skeleton
export function RepositoryCardSkeleton() {
  return (
    <div className="border-2 border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-5 w-5 rounded" />
      </div>
      <div className="space-y-2 mb-3">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-16 rounded-full" />
        <div className="flex items-center space-x-3">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-8" />
        </div>
      </div>
    </div>
  );
}

// Portfolio Card Skeleton
export function PortfolioCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <div className="space-y-2">
            <div className="flex items-center">
              <Skeleton className="h-4 w-16 mr-2" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-center">
              <Skeleton className="h-4 w-20 mr-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
        <Skeleton className="h-12 w-12 rounded" />
      </div>

      <div className="pt-4 border-t border-gray-100">
        <div className="flex gap-3">
          <Skeleton className="flex-1 h-10 rounded-lg" />
          <Skeleton className="flex-1 h-10 rounded-lg" />
          <Skeleton className="flex-1 h-10 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Repository Grid Skeleton
export function RepositoryGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <RepositoryCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Portfolio Grid Skeleton
export function PortfolioGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <PortfolioCardSkeleton key={i} />
      ))}
    </div>
  );
}
