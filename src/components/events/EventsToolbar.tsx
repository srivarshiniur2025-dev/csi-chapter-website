import { Search } from 'lucide-react';
import type { EventCategoryFilter, EventTimeFilter } from '../../lib/eventFilters';
import { EVENT_CATEGORY_FILTERS } from '../../lib/eventFilters';
import './EventsToolbar.css';

interface EventsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  timeFilter: EventTimeFilter;
  onTimeFilterChange: (filter: EventTimeFilter) => void;
  categoryFilter: EventCategoryFilter;
  onCategoryFilterChange: (filter: EventCategoryFilter) => void;
  resultCount: number;
}

export default function EventsToolbar({
  search,
  onSearchChange,
  timeFilter,
  onTimeFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  resultCount,
}: EventsToolbarProps) {
  return (
    <div className="events-toolbar" role="search">
      <label className="events-toolbar__search">
        <Search size={16} strokeWidth={1.5} aria-hidden />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search events, venues, topics…"
          aria-label="Search events"
        />
      </label>

      <div className="events-toolbar__row">
        <div className="events-toolbar__tabs" role="tablist" aria-label="Event timeframe">
          {(
            [
              ['upcoming', 'Upcoming'],
              ['past', 'Past'],
              ['all', 'All'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={timeFilter === id}
              className={`events-toolbar__tab${timeFilter === id ? ' events-toolbar__tab--active' : ''}`}
              onClick={() => onTimeFilterChange(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="events-toolbar__count" aria-live="polite">
          {resultCount} event{resultCount === 1 ? '' : 's'}
        </p>
      </div>

      <div className="events-toolbar__categories" role="tablist" aria-label="Event categories">
        {EVENT_CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={categoryFilter === cat}
            className={`events-toolbar__cat${categoryFilter === cat ? ' events-toolbar__cat--active' : ''}`}
            onClick={() => onCategoryFilterChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
