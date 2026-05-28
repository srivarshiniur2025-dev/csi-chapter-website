import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Bookmark, CalendarClock, Medal, Sparkles, X } from 'lucide-react';
import { dispatchOpenNova, useAuth } from '../../contexts/AuthContext';
import { scrollToSectionSmooth } from '../../lib/lenisScroll';
import './MemberDashboard.css';

const CINEMATIC_EASE = [0.22, 1, 0.36, 1] as const;

export default function MemberDashboard() {
  const { user, profile, dashboardOpen, closeDashboard, signOut, refreshProfile, apiReady, openAdmin } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (dashboardOpen && apiReady) void refreshProfile();
  }, [dashboardOpen, apiReady, refreshProfile]);

  useEffect(() => {
    if (!dashboardOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeDashboard();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dashboardOpen, closeDashboard]);

  if (!user || typeof document === 'undefined') return null;

  const initials =
    (profile?.displayName || user.displayName || user.email || 'U')
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';

  const stats = [
    { label: 'Registered', value: profile?.registeredEvents.length ?? 0 },
    { label: 'Bookmarks', value: profile?.bookmarkedEvents.length ?? 0 },
    { label: 'Achievements', value: profile?.achievements.length ?? 0 },
  ];

  return createPortal(
    <AnimatePresence>
      {dashboardOpen && (
        <>
          <motion.div
            className="dash-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDashboard}
            aria-hidden
          />
          <motion.aside
            className="dash-panel"
            role="dialog"
            aria-label="Member dashboard"
            data-lenis-prevent
            initial={{ opacity: 0, x: 24, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 16, scale: 0.98 }}
            transition={{ duration: 0.32, ease: CINEMATIC_EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="dash-panel__header">
              <p className="dash-panel__title">Member Hub</p>
              <button type="button" className="dash-panel__close" onClick={closeDashboard} aria-label="Close">
                <X size={14} strokeWidth={2} />
              </button>
            </header>

            <div className="dash-panel__body">
              <div className="dash-profile">
                <span className="dash-profile__avatar">{initials}</span>
                <div>
                  <p className="dash-profile__name">{profile?.displayName || user.displayName || 'Member'}</p>
                  <p className="dash-profile__meta">
                    {profile?.department || 'CSI Member'} · {user.email}
                  </p>
                </div>
              </div>

              <section className="dash-welcome">
                <p className="dash-section__label">Personalized welcome</p>
                <p>
                  Welcome back, {(profile?.displayName || 'Member').split(' ')[0]}.
                  CSI Nova recommends checking upcoming events in your top interests:
                  {' '}
                  {(profile?.domainInterests ?? []).slice(0, 2).join(' · ') || 'Web Development'}.
                </p>
              </section>

              <section>
                <p className="dash-section__label">Platform stats</p>
                <div className="dash-stats">
                  {stats.map((item, i) => (
                    <motion.div
                      key={item.label}
                      className="dash-stat"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * i }}
                    >
                      <strong>{item.value}</strong>
                      <span>{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </section>

              <section>
                <p className="dash-section__label">Registered events</p>
                {profile?.registeredEvents.length ? (
                  <ul className="dash-list">
                    {profile.registeredEvents.slice(0, 4).map((ev) => (
                      <li key={ev.registrationId}>
                        {ev.eventTitle}
                        <span>{ev.registrationId}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="dash-empty">No events yet — register from the Events section.</p>
                )}
              </section>

              <section>
                <p className="dash-section__label">Bookmarked events</p>
                {profile?.bookmarkedEvents.length ? (
                  <div className="dash-chips">
                    {profile.bookmarkedEvents.slice(0, 4).map((item) => (
                      <span key={item} className="dash-chip">
                        <Bookmark size={12} /> {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="dash-empty">Bookmark events to track them quickly.</p>
                )}
              </section>

              <section>
                <p className="dash-section__label">Registration history</p>
                {profile?.registrationHistory.length ? (
                  <ul className="dash-list">
                    {profile.registrationHistory.slice(0, 3).map((ev) => (
                      <li key={`${ev.registrationId}-history`}>
                        {ev.eventTitle}
                        <span>{new Date(ev.registeredAt).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="dash-empty">Your registration history appears here.</p>
                )}
              </section>

              <section>
                <p className="dash-section__label">Saved resources</p>
                <ul className="dash-list">
                  {(profile?.savedResources ?? []).slice(0, 4).map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </section>

              <section>
                <p className="dash-section__label">Domain interests</p>
                <div className="dash-chips">
                  {(profile?.domainInterests ?? ['Web Development']).map((d) => (
                    <span key={d} className="dash-chip">
                      {d}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <p className="dash-section__label">Achievements & certificates</p>
                {(profile?.achievements ?? []).length ? (
                  <div className="dash-chips">
                    {(profile?.achievements ?? []).slice(0, 4).map((badge) => (
                      <span key={badge} className="dash-chip">
                        <Medal size={12} /> {badge}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="dash-empty">Complete events to unlock achievements.</p>
                )}
              </section>

              <section>
                <p className="dash-section__label">Upcoming reminders</p>
                {(profile?.upcomingReminders ?? []).length ? (
                  <ul className="dash-list">
                    {(profile?.upcomingReminders ?? []).slice(0, 3).map((rem) => (
                      <li key={rem.id}>
                        {rem.title}
                        <span>{new Date(rem.when).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="dash-empty">No reminders yet. Register for events to get nudges.</p>
                )}
              </section>

              <section>
                <p className="dash-section__label">Quick actions</p>
                <div className="dash-actions">
                  <button type="button" className="dash-action" onClick={() => { closeDashboard(); scrollToSectionSmooth('events'); }}>
                    <CalendarClock size={12} /> Browse events
                  </button>
                  <button type="button" className="dash-action" onClick={() => { closeDashboard(); scrollToSectionSmooth('team'); }}>
                    <Bell size={12} /> Meet the team
                  </button>
                  <button
                    type="button"
                    className="dash-action dash-action--primary"
                    onClick={() => {
                      closeDashboard();
                      dispatchOpenNova();
                    }}
                  >
                    <Sparkles size={12} /> Ask CSI Nova
                  </button>
                </div>
              </section>

              {isAdmin ? (
                <button type="button" className="dash-action dash-action--primary" onClick={() => openAdmin()}>
                  Open admin console
                </button>
              ) : null}

              <button type="button" className="dash-signout" onClick={() => signOut()}>
                Sign out
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
