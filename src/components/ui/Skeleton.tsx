import './Skeleton.css';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

export function Skeleton({ className = '', width, height, rounded = 'md' }: SkeletonProps) {
  return (
    <span
      className={`csi-skeleton csi-skeleton--${rounded} ${className}`.trim()}
      style={{ width, height }}
      aria-hidden
    />
  );
}

export function EventsCarouselSkeleton() {
  return (
    <div className="events-skeleton" aria-busy aria-label="Loading events">
      <Skeleton className="events-skeleton__card" height={400} rounded="lg" />
      <div className="events-skeleton__dots">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} width={8} height={8} rounded="full" />
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="csi-skeleton-dash" aria-busy>
      <Skeleton height={48} rounded="md" />
      <div className="csi-skeleton-dash__grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} height={72} rounded="md" />
        ))}
      </div>
      <Skeleton height={120} rounded="md" />
    </div>
  );
}
