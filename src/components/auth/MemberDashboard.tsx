import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  Bookmark,
  CalendarClock,
  ChevronRight,
  LayoutGrid,
  Medal,
  Sparkles,
  Ticket,
  UserRound,
  X,
} from 'lucide-react';
import { CHAPTER_EVENTS_CATALOG, type EventCatalogItem } from '../../data/chapterEvents';
import { dispatchOpenNova, useAuth } from '../../contexts/AuthContext';
import { api, isApiConfigured } from '../../lib/api';
import {
  DEPARTMENT_OPTIONS,
  DOMAIN_INTEREST_OPTIONS,
  PLATFORM_RESOURCE_SUGGESTIONS,
  type DomainInterest,
} from '../../lib/userDashboard';
import {
  formatEventCountdown,
  getMemberTier,
  getRecommendedEvents,
  getTimeGreeting,
} from '../../lib/personalization';
import { scrollToSectionSmooth } from '../../lib/lenisScroll';
import './MemberDashboard.css';

const CINEMATIC_EASE = [0.22, 1, 0.36, 1] as const;
type DashTab = 'overview' | 'events' | 'profile';

export default function MemberDashboard() {
  const {
    user,
    profile,
    dashboardOpen,
    closeDashboard,
    signOut,
    refreshProfile,
    apiReady,
    openAdmin,
    updateUserProfile,
  } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [tab, setTab] = useState<DashTab>('overview');
  const [catalog, setCatalog] = useState<EventCatalogItem[]>(CHAPTER_EVENTS_CATALOG);
  const [editName, setEditName] = useState('');
  const [editDept, setEditDept] = useState('');
  const [editDomains, setEditDomains] = useState<DomainInterest[]>([]);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    if (dashboardOpen && apiReady) void refreshProfile();
  }, [dashboardOpen, apiReady, refreshProfile]);

  useEffect(() => {
    if (!dashboardOpen || !isApiConfigured()) return;
    api
      .events()
      .then(({ events }) => {
        if (events?.length) {
          setCatalog(
            events.map((e) => ({
              id: e.id,
              title: e.title,
              date: e.date,
              label: e.label,
              startISO: e.startISO,
              shortDescription: e.shortDescription,
            }))
          );
        }
      })
      .catch(() => {});
  }, [dashboardOpen]);

  useEffect(() => {
    if (!dashboardOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeDashboard();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [dashboardOpen, closeDashboard]);

  useEffect(() => {
    if (profile) {
      setEditName(profile.displayName);
      setEditDept(profile.department);
      setEditDomains(profile.domainInterests ?? []);
    }
  }, [profile, dashboardOpen]);

  const registeredIds = useMemo(
    () => (profile?.registeredEvents ?? []).map((e) => e.eventId),
    [profile?.registeredEvents]
  );

  const recommended = useMemo(
    () => getRecommendedEvents(profile?.domainInterests ?? [], catalog, registeredIds, 3),
    [profile?.domainInterests, catalog, registeredIds]
  );

  const tier = useMemo(
    () => getMemberTier(profile?.registeredEvents.length ?? 0),
    [profile?.registeredEvents.length]
  );

  const firstName = (profile?.displayName || user?.displayName || 'Member').split(' ')[0];

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaveMsg('');
    updateUserProfile({
      displayName: editName.trim(),
      department: editDept,
      domainInterests: editDomains,
    });
    if (apiReady) {
      try {
        await api.updateProfile({
          name: editName.trim(),
          department: editDept,
          domainInterests: editDomains,
        });
        await refreshProfile();
      } catch {
        /* local profile already saved */
      }
    }
    setSaveMsg('Profile updated.');
    setTimeout(() => setSaveMsg(''), 2500);
  };

  const toggleEditDomain = (d: DomainInterest) => {
    setEditDomains((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  };

  if (!user || typeof document === 'undefined') return null;

  const initials =
    (profile?.displayName || user.displayName || user.email || 'U')
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';

  const stats = [
    { label: 'Events', value: profile?.registeredEvents.length ?? 0, icon: Ticket },
    { label: 'Bookmarks', value: profile?.bookmarkedEvents.length ?? 0, icon: Bookmark },
    { label: 'Badges', value: profile?.achievements.length ?? 0, icon: Medal },
    { label: 'Reminders', value: profile?.upcomingReminders.length ?? 0, icon: Bell },
  ];

  return createPortal(
    <AnimatePresence>
      {dashboardOpen && (
        <motion.div
          className="pdash-stage"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: CINEMATIC_EASE }}
        >
          <motion.div
            className="pdash-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              closeDashboard();
            }}
            aria-hidden
          />
          <div className="pdash-stage__center">
            <motion.article
              className="pdash-panel"
              role="dialog"
              aria-label="Your personalized CSI dashboard"
              data-lenis-prevent
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.36, ease: CINEMATIC_EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pdash-panel__glow" aria-hidden />

              <header className="pdash-header">
                <div>
                  <p className="pdash-header__eyebrow">CSI Member Platform</p>
                  <h2 className="pdash-header__title">Your Dashboard</h2>
                </div>
                <button type="button" className="pdash-header__close" onClick={closeDashboard} aria-label="Close">
                  <X size={18} />
                </button>
              </header>

              <div className="pdash-hero">
                <span className="pdash-hero__avatar">{initials}</span>
                <div className="pdash-hero__copy">
                  <p className="pdash-hero__greeting">
                    {getTimeGreeting()}, <strong>{firstName}</strong>
                  </p>
                  <p className="pdash-hero__meta">
                    {profile?.department || 'CSI Member'}
                    {profile?.domainInterests?.length
                      ? ` · ${profile.domainInterests.slice(0, 2).join(' · ')}`
                      : ''}
                  </p>
                  <div className="pdash-hero__tier">
                    <span>{tier.label}</span>
                    <div className="pdash-hero__bar">
                      <motion.span
                        initial={{ width: 0 }}
                        animate={{ width: `${tier.progress}%` }}
                        transition={{ duration: 0.8, ease: CINEMATIC_EASE }}
                      />
                    </div>
                    <small>{tier.nextLabel}</small>
                  </div>
                </div>
              </div>

              <nav className="pdash-tabs" aria-label="Dashboard sections">
                {(
                  [
                    { id: 'overview', label: 'Overview', icon: LayoutGrid },
                    { id: 'events', label: 'My Events', icon: CalendarClock },
                    { id: 'profile', label: 'Profile', icon: UserRound },
                  ] as const
                ).map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    className={`pdash-tab${tab === id ? ' pdash-tab--active' : ''}`}
                    onClick={() => setTab(id)}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </nav>

              <div className="pdash-body">
                <AnimatePresence mode="wait">
                  {tab === 'overview' && (
                    <motion.div
                      key="overview"
                      className="pdash-grid"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.22 }}
                    >
                      <div className="pdash-stats">
                        {stats.map((s, i) => (
                          <motion.div
                            key={s.label}
                            className="pdash-stat"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <s.icon size={14} />
                            <strong>{s.value}</strong>
                            <span>{s.label}</span>
                          </motion.div>
                        ))}
                      </div>

                      <section className="pdash-card pdash-card--wide">
                        <h3>Recommended for you</h3>
                        <p className="pdash-card__hint">
                          Based on your domain interests — register from the Events section.
                        </p>
                        <div className="pdash-reco">
                          {recommended.length ? (
                            recommended.map((ev) => (
                              <button
                                key={ev.id}
                                type="button"
                                className="pdash-reco__item"
                                onClick={() => {
                                  closeDashboard();
                                  scrollToSectionSmooth('events');
                                }}
                              >
                                <div>
                                  <strong>{ev.title}</strong>
                                  <span>{ev.label} · {ev.date}</span>
                                </div>
                                <span className="pdash-reco__when">{formatEventCountdown(ev.startISO)}</span>
                                <ChevronRight size={14} />
                              </button>
                            ))
                          ) : (
                            <p className="pdash-empty">No upcoming matches — browse all events below.</p>
                          )}
                        </div>
                      </section>

                      <section className="pdash-card">
                        <h3>Upcoming reminders</h3>
                        {(profile?.upcomingReminders ?? []).length ? (
                          <ul className="pdash-timeline">
                            {(profile?.upcomingReminders ?? []).slice(0, 4).map((rem) => (
                              <li key={rem.id}>
                                <span className="pdash-timeline__dot" />
                                <div>
                                  <strong>{rem.title}</strong>
                                  <span>{new Date(rem.when).toLocaleString()}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="pdash-empty">Register for events to get personalized reminders here.</p>
                        )}
                      </section>

                      <section className="pdash-card">
                        <h3>Quick actions</h3>
                        <div className="pdash-actions">
                          <button
                            type="button"
                            onClick={() => {
                              closeDashboard();
                              scrollToSectionSmooth('events');
                            }}
                          >
                            <CalendarClock size={14} /> Browse events
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              closeDashboard();
                              dispatchOpenNova();
                            }}
                          >
                            <Sparkles size={14} /> Ask CSI Nova
                          </button>
                          {isAdmin ? (
                            <button type="button" className="pdash-actions__admin" onClick={() => openAdmin()}>
                              Admin console
                            </button>
                          ) : null}
                        </div>
                      </section>
                    </motion.div>
                  )}

                  {tab === 'events' && (
                    <motion.div
                      key="events"
                      className="pdash-stack"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                    >
                      <section className="pdash-card">
                        <h3>Registered events</h3>
                        {profile?.registeredEvents.length ? (
                          <ul className="pdash-list">
                            {(profile?.registeredEvents ?? []).map((ev) => (
                              <li key={ev.registrationId}>
                                <div>
                                  <strong>{ev.eventTitle}</strong>
                                  <span>ID {ev.registrationId}</span>
                                  {ev.eventDate ? (
                                    <span>{new Date(ev.eventDate).toLocaleString()}</span>
                                  ) : null}
                                </div>
                                <Ticket size={16} className="pdash-list__icon" />
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="pdash-empty">No registrations yet.</p>
                        )}
                      </section>

                      <section className="pdash-card">
                        <h3>Bookmarks</h3>
                        {profile?.bookmarkedEvents.length ? (
                          <div className="pdash-chips">
                            {(profile?.bookmarkedEvents ?? []).map((t) => (
                              <span key={t} className="pdash-chip">
                                <Bookmark size={12} /> {t}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="pdash-empty">Bookmark events from the carousel to track them.</p>
                        )}
                      </section>

                      <section className="pdash-card">
                        <h3>History</h3>
                        {profile?.registrationHistory.length ? (
                          <ul className="pdash-list pdash-list--compact">
                            {(profile?.registrationHistory ?? []).map((ev) => (
                              <li key={`h-${ev.registrationId}`}>
                                <strong>{ev.eventTitle}</strong>
                                <span>{new Date(ev.registeredAt).toLocaleString()}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="pdash-empty">Your registration history will appear here.</p>
                        )}
                      </section>
                    </motion.div>
                  )}

                  {tab === 'profile' && (
                    <motion.div
                      key="profile"
                      className="pdash-stack"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                    >
                      <section className="pdash-card">
                        <h3>Edit profile</h3>
                        <div className="pdash-form">
                          <label>
                            Display name
                            <input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              placeholder="Your name"
                            />
                          </label>
                          <label>
                            Department
                            <select value={editDept} onChange={(e) => setEditDept(e.target.value)}>
                              <option value="">Select department</option>
                              {DEPARTMENT_OPTIONS.map((d) => (
                                <option key={d} value={d}>
                                  {d}
                                </option>
                              ))}
                            </select>
                          </label>
                          <fieldset>
                            <legend>Domain interests</legend>
                            <div className="pdash-chips pdash-chips--select">
                              {DOMAIN_INTEREST_OPTIONS.map((d) => (
                                <button
                                  key={d}
                                  type="button"
                                  className={`pdash-chip pdash-chip--btn${editDomains.includes(d) ? ' is-on' : ''}`}
                                  onClick={() => toggleEditDomain(d)}
                                >
                                  {d}
                                </button>
                              ))}
                            </div>
                          </fieldset>
                          <button type="button" className="pdash-save" onClick={() => void handleSaveProfile()}>
                            Save profile
                          </button>
                          {saveMsg ? <p className="pdash-save-msg">{saveMsg}</p> : null}
                        </div>
                      </section>

                      <section className="pdash-card">
                        <h3>Achievements</h3>
                        {(profile?.achievements ?? []).length ? (
                          <div className="pdash-chips">
                            {(profile?.achievements ?? []).map((a) => (
                              <span key={a} className="pdash-chip">
                                <Medal size={12} /> {a}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="pdash-empty">Complete events to earn badges.</p>
                        )}
                      </section>

                      <section className="pdash-card">
                        <h3>Saved resources</h3>
                        {(profile?.savedResources ?? []).length ? (
                          <ul className="pdash-list pdash-list--compact">
                            {(profile?.savedResources ?? []).map((r) => (
                              <li key={r}>{r}</li>
                            ))}
                          </ul>
                        ) : (
                          <>
                            <p className="pdash-empty">Nothing saved yet.</p>
                            <p className="pdash-card__hint">Suggested resources</p>
                            <ul className="pdash-list pdash-list--compact pdash-list--muted">
                              {PLATFORM_RESOURCE_SUGGESTIONS.map((r) => (
                                <li key={r}>{r}</li>
                              ))}
                            </ul>
                          </>
                        )}
                      </section>

                      <p className="pdash-email">{user.email}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <footer className="pdash-footer">
                <button type="button" className="pdash-signout" onClick={() => signOut()}>
                  Sign out
                </button>
              </footer>
            </motion.article>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
