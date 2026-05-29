import type { EventStatus } from '../../lib/eventFilters';
import './EventStatusBadge.css';

interface EventStatusBadgeProps {
  status: EventStatus;
  compact?: boolean;
}

export default function EventStatusBadge({ status, compact }: EventStatusBadgeProps) {
  return (
    <span className={`evt-status evt-status--${status}${compact ? ' evt-status--compact' : ''}`}>
      {status === 'upcoming' && 'Open'}
      {status === 'soon' && 'Starting soon'}
      {status === 'past' && 'Completed'}
      {status === 'sold-out' && 'Sold out'}
    </span>
  );
}
