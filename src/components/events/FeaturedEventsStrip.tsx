import { Star } from 'lucide-react';
import type { ChapterEvent } from '../Events';
import './FeaturedEventsStrip.css';

interface FeaturedEventsStripProps {
  events: ChapterEvent[];
  activeId?: string;
  onSelect: (event: ChapterEvent) => void;
}

export default function FeaturedEventsStrip({ events, activeId, onSelect }: FeaturedEventsStripProps) {
  if (!events.length) return null;

  return (
    <div className="featured-events" aria-label="Featured events">
      <p className="featured-events__label">
        <Star size={14} aria-hidden /> Featured
      </p>
      <div className="featured-events__scroll">
        {events.map((ev) => (
          <button
            key={ev.id}
            type="button"
            className={`featured-events__chip${activeId === ev.id ? ' featured-events__chip--active' : ''}`}
            onClick={() => onSelect(ev)}
          >
            <img src={ev.image} alt="" loading="lazy" decoding="async" />
            <span>
              <strong>{ev.title}</strong>
              <small>{ev.date}</small>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
