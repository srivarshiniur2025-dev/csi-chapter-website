import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, Users, Calendar, Ticket, X } from 'lucide-react';
import { api } from '../../lib/api';
import './AdminPanel.css';

const CINEMATIC_EASE = [0.22, 1, 0.36, 1] as const;


interface Analytics {
  users: number;
  events: number;
  registrations: number;
  announcements: number;
}

import { useAuth } from '../../contexts/AuthContext';

export default function AdminPanel() {
  const { user, adminOpen, closeAdmin } = useAuth();
  const open = adminOpen && user?.role === 'admin';
  const onClose = closeAdmin;
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [recent, setRecent] = useState<Array<{ registrationId?: string; user?: { name?: string }; event?: { title?: string } }>>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setError('');
    api
      .adminAnalytics()
      .then((data) => {
        setAnalytics(data.analytics);
        setRecent((data.recentRegistrations as typeof recent) ?? []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load admin data'));
  }, [open]);

  if (typeof document === 'undefined') return null;

  const stats = analytics
    ? [
        { label: 'Members', value: analytics.users, icon: Users },
        { label: 'Events', value: analytics.events, icon: Calendar },
        { label: 'Registrations', value: analytics.registrations, icon: Ticket },
        { label: 'Announcements', value: analytics.announcements, icon: BarChart3 },
      ]
    : [];

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="admin-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            className="admin-panel"
            role="dialog"
            aria-label="Admin dashboard"
            data-lenis-prevent
            initial={{ opacity: 0, x: 24, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 16, scale: 0.98 }}
            transition={{ duration: 0.32, ease: CINEMATIC_EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="admin-panel__header">
              <p className="admin-panel__title">Admin Console</p>
              <button type="button" className="admin-panel__close" onClick={onClose} aria-label="Close">
                <X size={14} />
              </button>
            </header>

            <div className="admin-panel__body">
              {error ? <p className="admin-panel__error">{error}</p> : null}

              <section>
                <p className="admin-panel__label">Platform analytics</p>
                <div className="admin-stats">
                  {stats.map((item) => (
                    <div key={item.label} className="admin-stat">
                      <item.icon size={14} />
                      <strong>{item.value}</strong>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <p className="admin-panel__label">Recent registrations</p>
                {recent.length ? (
                  <ul className="admin-list">
                    {recent.map((r, i) => (
                      <li key={r.registrationId ?? i}>
                        {r.user?.name ?? 'Member'} — {r.event?.title ?? 'Event'}
                        <span>{r.registrationId}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="admin-panel__empty">No registrations yet.</p>
                )}
              </section>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
