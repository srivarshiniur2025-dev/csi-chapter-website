import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, MapPin, Ticket, User, Users, X } from 'lucide-react';
import type { ChapterEvent } from '../Events';
import { getSpotsLeft } from '../../lib/eventFilters';
import './EventDetailPanel.css';

const EASE = [0.22, 1, 0.36, 1] as const;

interface EventDetailPanelProps {
  event: ChapterEvent | null;
  registered?: boolean;
  onClose: () => void;
  onRegister: () => void;
}

export default function EventDetailPanel({
  event,
  registered,
  onClose,
  onRegister,
}: EventDetailPanelProps) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {event && (
        <motion.div
          className="evt-detail"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: EASE }}
          data-lenis-prevent
        >
          <button type="button" className="evt-detail__backdrop" aria-label="Close" onClick={onClose} />
          <motion.article
            className="evt-detail__panel"
            role="dialog"
            aria-labelledby="evt-detail-title"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.38, ease: EASE }}
          >
            <div className="evt-detail__hero">
              <img src={event.image} alt={event.imageAlt} loading="lazy" decoding="async" />
              <div className="evt-detail__hero-overlay" />
              <button type="button" className="evt-detail__close" onClick={onClose} aria-label="Close">
                <X size={18} />
              </button>
              {event.featured ? <span className="evt-detail__featured">Featured</span> : null}
            </div>
            <div className="evt-detail__body">
              <span className="evt-detail__label">{event.label}</span>
              <h2 id="evt-detail-title">{event.title}</h2>
              <p className="evt-detail__meta">
                <Calendar size={14} aria-hidden /> {event.date}
              </p>
              <p className="evt-detail__meta">
                <MapPin size={14} aria-hidden /> {event.venue}
              </p>
              <p className="evt-detail__meta evt-detail__meta--seats">
                <Users size={14} aria-hidden /> <strong>{getSpotsLeft(event)}</strong> seats available
              </p>
              <p className="evt-detail__desc">{event.fullDescription || event.shortDescription}</p>
              <div className="evt-detail__speaker">
                <User size={14} aria-hidden />
                <div>
                  <strong>{event.speaker.name}</strong>
                  <span>{event.speaker.role}</span>
                </div>
              </div>
              <div className="evt-detail__actions">
                {registered ? (
                  <span className="evt-detail__registered">You are registered</span>
                ) : (
                  <button type="button" className="evt-detail__register" onClick={onRegister}>
                    Register now
                    <Ticket size={16} aria-hidden />
                  </button>
                )}
                <button type="button" className="evt-detail__ghost" onClick={onClose}>
                  Back to events
                </button>
              </div>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
