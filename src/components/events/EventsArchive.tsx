import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import type { ChapterEvent } from '../Events';
import { filterEventsByTime, getEventStatus, sortEventsByDate } from '../../lib/eventFilters';
import EventStatusBadge from './EventStatusBadge';
import './EventsArchive.css';

const EASE = [0.22, 1, 0.36, 1] as const;

interface EventsArchiveProps {
  events: ChapterEvent[];
  onSelect: (event: ChapterEvent) => void;
}

export default function EventsArchive({ events, onSelect }: EventsArchiveProps) {
  const past = sortEventsByDate(filterEventsByTime(events, 'past'), 'desc').slice(0, 6);
  if (!past.length) return null;

  return (
    <section className="events-archive" aria-labelledby="events-archive-heading">
      <header className="events-archive__header">
        <h3 id="events-archive-heading">Past events archive</h3>
        <p>Completed workshops, hackathons, and competitions from recent CSI seasons.</p>
      </header>
      <ul className="events-archive__list">
        {past.map((event, index) => (
          <motion.li
            key={event.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.04, ease: EASE }}
          >
            <button type="button" className="events-archive__item" onClick={() => onSelect(event)}>
              <div className="events-archive__thumb">
                <img src={event.image} alt="" loading="lazy" decoding="async" />
              </div>
              <div className="events-archive__body">
                <div className="events-archive__meta">
                  <span className="events-archive__label">{event.label}</span>
                  <EventStatusBadge status={getEventStatus(event)} compact />
                </div>
                <strong>{event.title}</strong>
                <span>
                  <Calendar size={12} aria-hidden /> {event.date}
                </span>
                <span>
                  <MapPin size={12} aria-hidden /> {event.venue}
                </span>
              </div>
            </button>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
