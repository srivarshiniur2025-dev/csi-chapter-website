import { useCallback, useEffect, useState, type CSSProperties, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, X } from 'lucide-react';
import { ApiError } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import {
  DEPARTMENT_OPTIONS,
  DOMAIN_INTEREST_OPTIONS,
  type DomainInterest,
} from '../../lib/userDashboard';
import './AuthModal.css';

const CINEMATIC_EASE = [0.22, 1, 0.36, 1] as const;

const PANEL_MOTION = {
  initial: { opacity: 0, scale: 0.88 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.94 },
  transition: { duration: 0.38, ease: CINEMATIC_EASE },
};

function mapAuthError(code: string): string {
  const map: Record<string, string> = {
    'auth/invalid-email': 'Invalid email address.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/email-already-in-use': 'An account already exists with this email.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed.',
    'auth/too-many-requests': 'Too many attempts. Try again later.',
  };
  return map[code] ?? 'Something went wrong. Please try again.';
}

function getErrorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  const code = (err as { code?: string }).code;
  if (code) return mapAuthError(code);
  if (err instanceof Error && err.message) return err.message;
  return 'Something went wrong. Please try again.';
}

function AuthParticles() {
  return (
    <div className="auth-stage__particles" aria-hidden>
      {Array.from({ length: 18 }, (_, i) => (
        <span
          key={i}
          className="auth-particle"
          style={
            {
              '--i': i,
              left: `${8 + ((i * 17) % 84)}%`,
              top: `${12 + ((i * 13) % 76)}%`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export default function AuthModal() {
  const {
    authOpen,
    authTab,
    closeAuth,
    firebaseReady,
    authMode,
    openAuth,
    signIn,
    signUp,
    signInGoogle,
    resetPassword,
  } = useAuth();

  const [tab, setTab] = useState(authTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [domainInterests, setDomainInterests] = useState<DomainInterest[]>(['Web Development']);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const authReady = true;

  useEffect(() => {
    if (authOpen) setTab(authTab);
  }, [authOpen, authTab]);

  useEffect(() => {
    if (!authOpen) return;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !busy && closeAuth();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
      window.removeEventListener('keydown', onKey);
    };
  }, [authOpen, busy, closeAuth]);

  useEffect(() => {
    if (!authOpen) {
      setError('');
      setInfo('');
      setPassword('');
      setConfirm('');
      setDepartment('');
      setDomainInterests(['Web Development']);
    }
  }, [authOpen]);

  const switchTab = useCallback(
    (next: 'login' | 'signup') => {
      setTab(next);
      openAuth(next);
      setError('');
      setInfo('');
    },
    [openAuth]
  );

  const onLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setBusy(true);
    try {
      await signIn(email, password, remember);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const onSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const displayName = name.trim() || email.trim().split('@')[0].replace(/[._]/g, ' ');
    if (!email.trim() || !password || !department) {
      setError('Enter email, password, and department.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setBusy(true);
    try {
      await signUp(displayName, email, password, department, domainInterests);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const onGoogle = async () => {
    setError('');
    setBusy(true);
    try {
      await signInGoogle();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const onForgot = async () => {
    setError('');
    setInfo('');
    if (!email.trim()) {
      setError('Enter your email above, then tap Forgot password.');
      return;
    }
    setBusy(true);
    try {
      await resetPassword(email);
      setInfo('Password reset link sent. Check your inbox.');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const toggleDomain = (domain: DomainInterest) => {
    setDomainInterests((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
    );
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {authOpen && (
        <motion.div
          className="auth-stage"
          role="presentation"
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: CINEMATIC_EASE }}
        >
          <motion.div
            className="auth-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: CINEMATIC_EASE }}
            onClick={() => !busy && closeAuth()}
            aria-hidden
          />

          <AuthParticles />

          <div className="auth-stage__focus" aria-hidden>
            <span className="auth-stage__halo auth-stage__halo--a" />
            <span className="auth-stage__halo auth-stage__halo--b" />
          </div>

          <div className="auth-stage__center">
            <motion.article
              className="auth-panel"
              role="dialog"
              aria-modal="true"
              aria-label="CSI authentication"
              {...PANEL_MOTION}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="auth-panel__shell" aria-hidden>
                <span className="auth-panel__neon" />
                <span className="auth-panel__scan" />
                <span className="auth-panel__sheen" />
              </div>

              <header className="auth-panel__header">
                <div className="auth-panel__brand">
                  <span className="auth-panel__icon">
                    <LayoutDashboard size={16} strokeWidth={2} />
                  </span>
                  <div>
                    <p className="auth-panel__title">CSI Member Platform</p>
                    <p className="auth-panel__subtitle">
                      Dashboard · event reminders · registrations · admin tools
                    </p>
                  </div>
                </div>
                <button type="button" className="auth-panel__close" onClick={closeAuth} aria-label="Close">
                  <X size={16} strokeWidth={2} />
                </button>
              </header>

              <div className="auth-panel__tabs" role="tablist" aria-label="Authentication mode">
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === 'login'}
                  className={`auth-panel__tab${tab === 'login' ? ' auth-panel__tab--active' : ''}`}
                  onClick={() => switchTab('login')}
                >
                  Login
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === 'signup'}
                  className={`auth-panel__tab${tab === 'signup' ? ' auth-panel__tab--active' : ''}`}
                  onClick={() => switchTab('signup')}
                >
                  Sign Up
                </button>
              </div>

              <div className="auth-panel__body">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    className="auth-panel__content"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.22, ease: CINEMATIC_EASE }}
                  >
                    <p className="auth-panel__features">
                      Sign in to unlock your personalized member hub, registered events, reminders,
                      bookmarks, and CSI Nova assistant. Admins can manage events from the admin console.
                    </p>

                    {authMode === 'local' && (
                      <div className="auth-alert auth-alert--info">
                        Demo mode: accounts are saved on this browser. For cloud sync, set{' '}
                        <code>VITE_API_URL</code> or Firebase keys in <code>.env</code>.
                      </div>
                    )}
                    {authMode === 'api' && (
                      <div className="auth-alert auth-alert--info auth-alert--compact">
                        Connected to CSI cloud API — registrations sync across devices.
                      </div>
                    )}

                    {error ? <div className="auth-alert">{error}</div> : null}
                    {info ? <div className="auth-alert auth-alert--success">{info}</div> : null}

                    <button
                      type="button"
                      className="auth-panel__google"
                      onClick={onGoogle}
                      disabled={busy || !firebaseReady}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </button>

                    <div className="auth-panel__divider">
                      <span>or email</span>
                    </div>

                    {tab === 'login' ? (
                      <form className="auth-form" onSubmit={onLogin}>
                        <div className="auth-field">
                          <label htmlFor="auth-email">Email</label>
                          <input
                            id="auth-email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@vitstudent.ac.in"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div className="auth-field">
                          <label htmlFor="auth-password">Password</label>
                          <input
                            id="auth-password"
                            type="password"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                        <div className="auth-row">
                          <label className="auth-check">
                            <input
                              type="checkbox"
                              checked={remember}
                              onChange={(e) => setRemember(e.target.checked)}
                            />
                            Remember me
                          </label>
                          <button type="button" className="auth-link" onClick={onForgot} disabled={busy}>
                            Forgot password?
                          </button>
                        </div>
                        <button type="submit" className="auth-submit" disabled={busy || !authReady}>
                          {busy ? 'Signing in…' : 'Login'}
                        </button>
                      </form>
                    ) : (
                      <form className="auth-form auth-form--signup" onSubmit={onSignup}>
                        <div className="auth-field">
                          <label htmlFor="auth-name">Full name</label>
                          <input
                            id="auth-name"
                            type="text"
                            autoComplete="name"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        <div className="auth-field">
                          <label htmlFor="auth-signup-email">Email</label>
                          <input
                            id="auth-signup-email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@vitstudent.ac.in"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div className="auth-field">
                          <label htmlFor="auth-dept">Department</label>
                          <select
                            id="auth-dept"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                          >
                            <option value="">Select department</option>
                            {DEPARTMENT_OPTIONS.map((dept) => (
                              <option key={dept} value={dept}>
                                {dept}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="auth-field">
                          <label>Domain interests</label>
                          <div className="auth-domain-grid">
                            {DOMAIN_INTEREST_OPTIONS.map((domain) => (
                              <label key={domain} className="auth-domain-chip">
                                <input
                                  type="checkbox"
                                  checked={domainInterests.includes(domain)}
                                  onChange={() => toggleDomain(domain)}
                                />
                                <span>{domain}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className="auth-field-row">
                          <div className="auth-field">
                            <label htmlFor="auth-signup-password">Password</label>
                            <input
                              id="auth-signup-password"
                              type="password"
                              autoComplete="new-password"
                              placeholder="Min. 6 characters"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                          <div className="auth-field">
                            <label htmlFor="auth-confirm">Confirm</label>
                            <input
                              id="auth-confirm"
                              type="password"
                              autoComplete="new-password"
                              placeholder="Repeat password"
                              value={confirm}
                              onChange={(e) => setConfirm(e.target.value)}
                            />
                          </div>
                        </div>
                        <button type="submit" className="auth-submit" disabled={busy || !authReady}>
                          {busy ? 'Creating account…' : 'Create account'}
                        </button>
                      </form>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.article>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
