import { useState, useEffect, useCallback, useMemo, type CSSProperties, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  X,
  Calendar,
  MapPin,
  Clock,
  Users,
  User,
  Mail,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  CalendarPlus,
  Ticket,
} from 'lucide-react';
import type { ChapterEvent } from './Events';
import {
  buildPassMatrix,
  downloadICS,
  generateRegistrationId,
  getCountdown,
  getSeatsTaken,
  pad2,
  recordSeatTaken,
  type RegistrationFormData,
  DOMAIN_OPTIONS,
  YEAR_DEPT_OPTIONS,
  parseEventStart,
} from '../lib/eventRegistration';
import { useAuth } from '../contexts/AuthContext';
import { api, getApiToken } from '../lib/api';
import './EventRegistrationModal.css';

const CINEMATIC_EASE = [0.22, 1, 0.36, 1] as const;

const EMPTY_FORM: RegistrationFormData = {
  name: '',
  email: '',
  domain: '',
  yearDept: '',
  message: '',
};

interface EventRegistrationModalProps {
  event: ChapterEvent;
  onClose: () => void;
}

function EventPassQR({ registrationId }: { registrationId: string }) {
  const matrix = useMemo(() => buildPassMatrix(registrationId), [registrationId]);
  const cell = 5;
  const gap = 1;
  const size = matrix.length * (cell + gap) + gap;

  return (
    <svg
      className="ereg-pass__qr"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Event pass QR code"
    >
      <rect width={size} height={size} fill="#06040f" rx={4} />
      {matrix.map((row, r) =>
        row.map((on, c) =>
          on ? (
            <rect
              key={`${r}-${c}`}
              x={gap + c * (cell + gap)}
              y={gap + r * (cell + gap)}
              width={cell}
              height={cell}
              fill="url(#eregQrGrad)"
              rx={0.5}
            />
          ) : null
        )
      )}
      <defs>
        <linearGradient id="eregQrGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c77dff" />
          <stop offset="100%" stopColor="#6b8cff" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const EventRegistrationModal = ({ event, onClose }: EventRegistrationModalProps) => {
  const { user, registerEvent, refreshProfile, apiReady } = useAuth();
  const [form, setForm] = useState<RegistrationFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationFormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [registrationId, setRegistrationId] = useState('');
  const [seatsTaken, setSeatsTaken] = useState(() => event.seatsTaken ?? getSeatsTaken(event.id));
  const [countdown, setCountdown] = useState(() =>
    getCountdown(parseEventStart(event.startISO))
  );

  const spotsLeft = Math.max(0, event.totalSeats - seatsTaken);
  const fillPercent = Math.min(100, Math.round((seatsTaken / event.totalSeats) * 100));

  const targetDate = useMemo(() => parseEventStart(event.startISO), [event.startISO]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !submitting && onClose();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose, submitting]);

  useEffect(() => {
    const tick = () => setCountdown(getCountdown(targetDate));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const validate = useCallback((): boolean => {
    const next: Partial<Record<keyof RegistrationFormData, string>> = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email';
    if (!form.domain) next.domain = 'Select your domain';
    if (!form.yearDept) next.yearDept = 'Select year & department';
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [form]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (spotsLeft <= 0 || !validate()) return;

    setSubmitting(true);
    try {
      if (apiReady && user && getApiToken()) {
        const { registration } = await api.registerEvent(event.id, {
          name: form.name.trim(),
          email: form.email.trim(),
          domain: form.domain,
          yearDept: form.yearDept,
          message: form.message.trim(),
        });
        const id = registration.registrationId;
        setRegistrationId(id);
        setSeatsTaken(registration.event?.seatsTaken ?? seatsTaken + 1);
        await refreshProfile();
      } else {
        await new Promise((r) => setTimeout(r, 900));
        const id = generateRegistrationId(event.id);
        const taken = recordSeatTaken(event.id);
        setSeatsTaken(taken);
        setRegistrationId(id);
        if (user) {
          registerEvent({
            id,
            eventId: event.id,
            eventTitle: event.title,
            registrationId: id,
            registeredAt: new Date().toISOString(),
            eventDate: event.startISO,
          });
        }
      }
      setSuccess(true);
    } catch (err) {
      setErrors({ email: err instanceof Error ? err.message : 'Registration failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddToCalendar = () => {
    downloadICS({
      title: event.title,
      description: event.fullDescription,
      location: event.venue,
      startISO: event.startISO,
      durationHours: event.id === 'codestorm' ? 24 : 3,
    });
  };

  const initials = event.speaker.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <motion.div
      className="ereg-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <div className="ereg-backdrop__particles" aria-hidden>
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} className="ereg-backdrop__particle" style={{ '--i': i } as CSSProperties} />
        ))}
      </div>

      <motion.div
        className="ereg-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ereg-title"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.42, ease: CINEMATIC_EASE }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ereg-panel__ambient" aria-hidden />
        <div className="ereg-panel__scanline" aria-hidden />
        <div className="ereg-panel__edge-glow" aria-hidden />

        <button type="button" className="ereg-close" onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              className="ereg-success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: CINEMATIC_EASE }}
            >
              <motion.div
                className="ereg-success__burst"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5, ease: CINEMATIC_EASE }}
              >
                <CheckCircle2 size={48} strokeWidth={1.5} />
              </motion.div>
              <h2 className="ereg-success__title">Registration Confirmed</h2>
              <p className="ereg-success__sub">
                You&apos;re registered for <strong>{event.title}</strong>
              </p>

              <div className="ereg-pass">
                <div className="ereg-pass__header">
                  <Ticket size={16} strokeWidth={1.5} />
                  <span>CSI Event Pass</span>
                </div>
                <div className="ereg-pass__body">
                  <EventPassQR registrationId={registrationId} />
                  <div className="ereg-pass__meta">
                    <span className="ereg-pass__id">{registrationId}</span>
                    <span>{form.name}</span>
                    <span>{event.date}</span>
                    <span>{event.venue}</span>
                  </div>
                </div>
                <div className="ereg-pass__holo" aria-hidden />
              </div>

              <div className="ereg-success__actions">
                <button type="button" className="ereg-btn ereg-btn--calendar" onClick={handleAddToCalendar}>
                  <CalendarPlus size={18} strokeWidth={1.5} />
                  Add to Calendar
                </button>
                <button type="button" className="ereg-btn ereg-btn--ghost" onClick={onClose}>
                  Done
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="register"
              className="ereg-register"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="ereg-banner">
                <img src={event.image} alt={event.imageAlt} />
                <div className="ereg-banner__overlay" />
                <div className="ereg-banner__grid" aria-hidden />
              </div>

              <div className="ereg-body">
                <div className="ereg-info">
                  <span className="ereg-label">{event.label}</span>
                  <h2 id="ereg-title" className="ereg-title">
                    {event.title}
                  </h2>

                  <div className="ereg-meta">
                    <span>
                      <Calendar size={14} strokeWidth={1.5} /> {event.date}
                    </span>
                    <span>
                      <MapPin size={14} strokeWidth={1.5} /> {event.venue}
                    </span>
                  </div>

                  <p className="ereg-desc">{event.fullDescription}</p>

                  <div className="ereg-speaker">
                    <div className="ereg-speaker__avatar">{initials}</div>
                    <div>
                      <div className="ereg-speaker__name">{event.speaker.name}</div>
                      <div className="ereg-speaker__role">{event.speaker.role}</div>
                    </div>
                  </div>

                  <div className="ereg-tech">
                    {event.techIcons.map((Icon: LucideIcon, i: number) => (
                      <span key={i} className="ereg-tech__icon">
                        <Icon size={16} strokeWidth={1.5} />
                      </span>
                    ))}
                  </div>

                  <div className="ereg-stats">
                    <div className="ereg-countdown">
                      <p className="ereg-stats__label">
                        <Clock size={13} strokeWidth={1.5} />
                        {countdown.isPast ? 'Event started' : 'Countdown'}
                      </p>
                      {countdown.isPast ? (
                        <p className="ereg-countdown__live">Live now</p>
                      ) : (
                        <div className="ereg-countdown__grid">
                          {(
                            [
                              ['days', countdown.days],
                              ['hrs', countdown.hours],
                              ['min', countdown.minutes],
                              ['sec', countdown.seconds],
                            ] as const
                          ).map(([label, val]) => (
                            <div key={label} className="ereg-countdown__unit">
                              <span>{pad2(val)}</span>
                              <small>{label}</small>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="ereg-seats">
                      <p className="ereg-stats__label">
                        <Users size={13} strokeWidth={1.5} />
                        Seat availability
                      </p>
                      <div className="ereg-seats__row">
                        <span className="ereg-seats__live">
                          <span className="ereg-seats__pulse" aria-hidden />
                          Live
                        </span>
                        <span className="ereg-seats__count">
                          {seatsTaken} / {event.totalSeats} filled
                        </span>
                      </div>
                      <div className="ereg-seats__bar">
                        <motion.span
                          className="ereg-seats__fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${fillPercent}%` }}
                          transition={{ duration: 0.8, ease: CINEMATIC_EASE }}
                        />
                      </div>
                      <p className={`ereg-spots${spotsLeft <= 5 ? ' ereg-spots--low' : ''}`}>
                        <Sparkles size={13} strokeWidth={1.5} />
                        <strong>{spotsLeft}</strong> spots left
                      </p>
                    </div>
                  </div>
                </div>

                <form className="ereg-form" onSubmit={handleSubmit} noValidate>
                  <p className="ereg-form__heading">Registration</p>

                  <label className="ereg-field">
                    <span>
                      <User size={14} /> Full name
                    </span>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Your name"
                      autoComplete="name"
                    />
                    {errors.name && <em>{errors.name}</em>}
                  </label>

                  <label className="ereg-field">
                    <span>
                      <Mail size={14} /> Email
                    </span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="you@vitstudent.ac.in"
                      autoComplete="email"
                    />
                    {errors.email && <em>{errors.email}</em>}
                  </label>

                  <label className="ereg-field">
                    <span>Domain / Interest</span>
                    <select
                      value={form.domain}
                      onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value }))}
                    >
                      <option value="">Select domain</option>
                      {DOMAIN_OPTIONS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    {errors.domain && <em>{errors.domain}</em>}
                  </label>

                  <label className="ereg-field">
                    <span>Year / Department</span>
                    <select
                      value={form.yearDept}
                      onChange={(e) => setForm((f) => ({ ...f, yearDept: e.target.value }))}
                    >
                      <option value="">Select year & dept</option>
                      {YEAR_DEPT_OPTIONS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                    {errors.yearDept && <em>{errors.yearDept}</em>}
                  </label>

                  <label className="ereg-field ereg-field--optional">
                    <span>
                      <MessageSquare size={14} /> Message <small>(optional)</small>
                    </span>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      placeholder="Questions or team details…"
                      rows={2}
                    />
                  </label>

                  <button
                    type="submit"
                    className="ereg-submit"
                    disabled={submitting || spotsLeft <= 0}
                  >
                    {submitting ? (
                      <span className="ereg-submit__loading">Securing your seat…</span>
                    ) : spotsLeft <= 0 ? (
                      'Event Full'
                    ) : (
                      <>
                        Register Now
                        <Sparkles size={16} strokeWidth={2} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default EventRegistrationModal;
