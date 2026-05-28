import { useEffect, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  Calendar,
  Image,
  Megaphone,
  Ticket,
  Users,
  X,
  Plus,
  Trash2,
} from 'lucide-react';
import { dispatchOpenNova, useAuth } from '../../contexts/AuthContext';
import { api, isApiConfigured, type ApiEvent } from '../../lib/api';
import { addLocalGalleryItem, loadLocalGallery, removeLocalGalleryItem } from '../../lib/localGallery';
import FuturisticSparkline from '../ecosystem/FuturisticSparkline';
import './AdminDashboard.css';

const EASE = [0.22, 1, 0.36, 1] as const;

type AdminTab = 'overview' | 'events' | 'gallery' | 'users' | 'announcements';

const emptyEvent = {
  slug: '',
  title: '',
  dateLabel: '',
  venue: '',
  label: '',
  image: '',
  shortDescription: '',
  fullDescription: '',
  startISO: '',
  totalSeats: 80,
};

export default function AdminDashboard() {
  const { user, adminOpen, closeAdmin } = useAuth();
  const open = adminOpen && user?.role === 'admin';

  const [tab, setTab] = useState<AdminTab>('overview');
  const [analytics, setAnalytics] = useState<{
    users: number;
    events: number;
    registrations: number;
    announcements: number;
  } | null>(null);
  const [recent, setRecent] = useState<Array<{ registrationId?: string; user?: { name?: string }; event?: { title?: string } }>>([]);
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [users, setUsers] = useState<Array<{ id: string; name: string; email: string; role: string }>>([]);
  const [gallery, setGallery] = useState(loadLocalGallery());
  const [announcements, setAnnouncements] = useState<Array<{ _id: string; title: string; body: string }>>([]);
  const [eventForm, setEventForm] = useState(emptyEvent);
  const [galleryForm, setGalleryForm] = useState({ title: '', category: 'Events', imageUrl: '', caption: '' });
  const [announceForm, setAnnounceForm] = useState({ title: '', body: '' });
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const refresh = async () => {
    setError('');
    if (isApiConfigured()) {
      try {
        const [a, ev, u, g, ann] = await Promise.all([
          api.adminAnalytics(),
          api.events(),
          api.adminUsers(),
          api.adminGallery(),
          api.adminAnnouncements(),
        ]);
        setAnalytics(a.analytics);
        setRecent((a.recentRegistrations as typeof recent) ?? []);
        setEvents(ev.events);
        setUsers(u.users.map((x) => ({ id: x.id, name: x.name, email: x.email, role: x.role })));
        setGallery(
          g.items.map((i) => ({
            id: i.id,
            title: i.title,
            category: i.category as typeof gallery[0]['category'],
            imageUrl: i.imageUrl,
            caption: i.caption,
          }))
        );
        setAnnouncements(ann.announcements);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load admin data');
      }
    } else {
      setGallery(loadLocalGallery());
      setAnalytics({ users: 1, events: 4, registrations: 0, announcements: 0 });
    }
  };

  useEffect(() => {
    if (!open) return;
    void refresh();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeAdmin();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, closeAdmin]);

  const onCreateEvent = async (e: FormEvent) => {
    e.preventDefault();
    setMsg('');
    if (!isApiConfigured()) {
      setMsg('Connect MongoDB API to publish events.');
      return;
    }
    try {
      await api.adminCreateEvent({
        ...eventForm,
        slug: eventForm.slug || eventForm.title.toLowerCase().replace(/\s+/g, '-'),
        startISO: eventForm.startISO || new Date().toISOString(),
        isPublished: true,
      });
      setEventForm(emptyEvent);
      setMsg('Event published.');
      void refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
    }
  };

  const onDeleteEvent = async (slug: string) => {
    if (!isApiConfigured() || !confirm('Delete this event?')) return;
    await api.adminDeleteEvent(slug);
    void refresh();
  };

  const onAddGallery = async (e: FormEvent) => {
    e.preventDefault();
    if (isApiConfigured()) {
      await api.adminCreateGalleryItem(galleryForm);
    } else {
      addLocalGalleryItem({
        title: galleryForm.title,
        category: galleryForm.category as 'Events',
        imageUrl: galleryForm.imageUrl,
        caption: galleryForm.caption,
      });
    }
    setGalleryForm({ title: '', category: 'Events', imageUrl: '', caption: '' });
    void refresh();
  };

  const onDeleteGallery = async (id: string) => {
    if (!confirm('Remove gallery image?')) return;
    if (isApiConfigured()) await api.adminDeleteGalleryItem(id);
    else removeLocalGalleryItem(id);
    void refresh();
  };

  const onAnnounce = async (e: FormEvent) => {
    e.preventDefault();
    if (!isApiConfigured()) {
      setMsg('API required for announcements.');
      return;
    }
    await api.adminCreateAnnouncement(announceForm);
    setAnnounceForm({ title: '', body: '' });
    void refresh();
  };

  if (typeof document === 'undefined') return null;

  const stats = analytics
    ? [
        { label: 'Members', value: analytics.users, icon: Users },
        { label: 'Events', value: analytics.events, icon: Calendar },
        { label: 'Registrations', value: analytics.registrations, icon: Ticket },
        { label: 'Announcements', value: analytics.announcements, icon: Megaphone },
      ]
    : [];

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="adm-stage"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          data-lenis-prevent
        >
          <motion.div className="adm-backdrop" onClick={closeAdmin} aria-hidden />
          <motion.article
            className="adm-panel"
            role="dialog"
            aria-label="CSI Admin Dashboard"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="adm-panel__header">
              <div>
                <p className="adm-panel__eyebrow">CSI Admin Console</p>
                <h2 className="adm-panel__title">Platform Control</h2>
              </div>
              <div className="adm-panel__header-actions">
                <button type="button" className="adm-btn-ghost" onClick={() => dispatchOpenNova()}>
                  Ask Nova
                </button>
                <button type="button" className="adm-panel__close" onClick={closeAdmin} aria-label="Close">
                  <X size={18} />
                </button>
              </div>
            </header>

            <nav className="adm-tabs" aria-label="Admin sections">
              {(
                [
                  ['overview', 'Overview', BarChart3],
                  ['events', 'Events', Calendar],
                  ['gallery', 'Gallery', Image],
                  ['users', 'Users', Users],
                  ['announcements', 'Announce', Megaphone],
                ] as const
              ).map(([id, label, Icon]) => (
                <button
                  key={id}
                  type="button"
                  className={`adm-tabs__btn${tab === id ? ' adm-tabs__btn--active' : ''}`}
                  onClick={() => setTab(id)}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </nav>

            <div className="adm-panel__body">
              {error ? <p className="adm-error">{error}</p> : null}
              {msg ? <p className="adm-msg">{msg}</p> : null}

              {tab === 'overview' && (
                <>
                  <div className="adm-analytics-grid">
                    {stats.map((s, i) => (
                      <div key={s.label} className="adm-chart-card adm-card--os">
                        <s.icon size={16} />
                        <strong>{s.value}</strong>
                        <span>{s.label}</span>
                        <FuturisticSparkline
                          values={[4 + i * 3, 8 + i * 2, 6 + i, 12 + i, 10 + i * 2, 14 + i]}
                        />
                      </div>
                    ))}
                  </div>
                  <section className="adm-card--os">
                    <h3 className="adm-section-title">Activity feed</h3>
                    <ul className="adm-feed">
                      {recent.length
                        ? recent.map((r, i) => (
                            <li key={r.registrationId ?? i}>
                              <Ticket size={14} />
                              {r.user?.name ?? 'Member'} registered for {r.event?.title ?? 'event'}
                            </li>
                          ))
                        : (
                          <li className="adm-feed__empty">No registrations yet.</li>
                          )}
                    </ul>
                  </section>
                </>
              )}

              {tab === 'events' && (
                <>
                  <form className="adm-form" onSubmit={onCreateEvent}>
                    <h3 className="adm-section-title">Add event</h3>
                    <div className="adm-form__grid">
                      <input placeholder="Slug (ai-nexus)" value={eventForm.slug} onChange={(e) => setEventForm({ ...eventForm, slug: e.target.value })} />
                      <input placeholder="Title" required value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} />
                      <input placeholder="Date label" value={eventForm.dateLabel} onChange={(e) => setEventForm({ ...eventForm, dateLabel: e.target.value })} />
                      <input placeholder="Venue" value={eventForm.venue} onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })} />
                      <input placeholder="Category label" value={eventForm.label} onChange={(e) => setEventForm({ ...eventForm, label: e.target.value })} />
                      <input placeholder="Banner image URL" value={eventForm.image} onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })} />
                      <input type="datetime-local" value={eventForm.startISO} onChange={(e) => setEventForm({ ...eventForm, startISO: e.target.value })} />
                      <input type="number" placeholder="Seats" value={eventForm.totalSeats} onChange={(e) => setEventForm({ ...eventForm, totalSeats: Number(e.target.value) })} />
                    </div>
                    <textarea placeholder="Short description" rows={2} value={eventForm.shortDescription} onChange={(e) => setEventForm({ ...eventForm, shortDescription: e.target.value })} />
                    <button type="submit" className="adm-btn-primary">
                      <Plus size={16} /> Publish event
                    </button>
                  </form>
                  <ul className="adm-list">
                    {events.map((ev) => (
                      <li key={ev.id}>
                        <span>{ev.title}</span>
                        <button type="button" onClick={() => onDeleteEvent(ev.id)} aria-label="Delete">
                          <Trash2 size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {tab === 'gallery' && (
                <>
                  <form className="adm-form" onSubmit={onAddGallery}>
                    <h3 className="adm-section-title">Upload gallery image</h3>
                    <div className="adm-form__grid">
                      <input placeholder="Title" required value={galleryForm.title} onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })} />
                      <select value={galleryForm.category} onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}>
                        {['Events', 'Workshops', 'Hackathons', 'Team', 'Technical'].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <input className="adm-form__wide" placeholder="Image URL" required value={galleryForm.imageUrl} onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })} />
                    </div>
                    <input placeholder="Caption" value={galleryForm.caption} onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })} />
                    <button type="submit" className="adm-btn-primary">
                      <Plus size={16} /> Add to gallery
                    </button>
                  </form>
                  <div className="adm-gallery-grid">
                    {gallery.map((g) => (
                      <div key={g.id} className="adm-gallery-thumb">
                        <img src={g.imageUrl} alt={g.title} />
                        <button type="button" onClick={() => onDeleteGallery(g.id)} aria-label="Delete">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {tab === 'users' && (
                <ul className="adm-list adm-list--users">
                  {users.map((u) => (
                    <li key={u.id}>
                      <div>
                        <strong>{u.name}</strong>
                        <span>{u.email}</span>
                      </div>
                      <span className={`adm-role adm-role--${u.role}`}>{u.role}</span>
                    </li>
                  ))}
                </ul>
              )}

              {tab === 'announcements' && (
                <>
                  <form className="adm-form" onSubmit={onAnnounce}>
                    <h3 className="adm-section-title">New announcement</h3>
                    <input placeholder="Title" required value={announceForm.title} onChange={(e) => setAnnounceForm({ ...announceForm, title: e.target.value })} />
                    <textarea placeholder="Message" rows={3} required value={announceForm.body} onChange={(e) => setAnnounceForm({ ...announceForm, body: e.target.value })} />
                    <button type="submit" className="adm-btn-primary">
                      <Megaphone size={16} /> Publish
                    </button>
                  </form>
                  <ul className="adm-list">
                    {announcements.map((a) => (
                      <li key={a._id}>
                        <span>{a.title}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
