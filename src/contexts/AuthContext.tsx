import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  browserLocalPersistence,
  browserSessionPersistence,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  createUserWithEmailAndPassword,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase';
import {
  api,
  apiUserToProfile,
  hasApiSession,
  isApiConfigured,
  mapRegistrations,
  setApiToken,
  type ApiUser,
} from '../lib/api';
import { getApiToken } from '../lib/apiToken';
import {
  getLocalSession,
  localSignIn,
  ensureDemoAdminAccount,
  localSignOut,
  localSignUp,
} from '../lib/localAuth';
import {
  addRegisteredEvent,
  loadUserProfile,
  saveUserProfile,
  toggleBookmarkedEvent,
  type DomainInterest,
  type RegisteredEventRecord,
  type UserProfile,
} from '../lib/userDashboard';

export type AuthMode = 'firebase' | 'local';

export type AuthTab = 'login' | 'signup';

export type AuthPortal = 'user' | 'admin';

export interface SessionUser {
  uid: string;
  email: string;
  displayName: string | null;
  role: string;
}

function firebaseToSession(u: FirebaseUser): SessionUser {
  return {
    uid: u.uid,
    email: u.email ?? '',
    displayName: u.displayName,
    role: 'user',
  };
}

function apiToSession(u: ApiUser): SessionUser {
  return {
    uid: u.id,
    email: u.email,
    displayName: u.name,
    role: u.role,
  };
}

interface AuthContextValue {
  user: SessionUser | null;
  profile: UserProfile | null;
  loading: boolean;
  firebaseReady: boolean;
  apiReady: boolean;
  authMode: AuthMode;
  authReady: boolean;
  authOpen: boolean;
  authTab: AuthTab;
  authPortal: AuthPortal;
  dashboardOpen: boolean;
  adminOpen: boolean;
  openAuth: (tab?: AuthTab, portal?: AuthPortal) => void;
  setAuthPortal: (portal: AuthPortal) => void;
  closeAuth: () => void;
  openDashboard: () => void;
  closeDashboard: () => void;
  openAdmin: () => void;
  closeAdmin: () => void;
  signIn: (email: string, password: string, remember: boolean) => Promise<void>;
  signUp: (
    name: string,
    email: string,
    password: string,
    department: string,
    domainInterests: DomainInterest[]
  ) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateUserProfile: (patch: Partial<UserProfile>) => void;
  registerEvent: (record: RegisteredEventRecord) => void;
  toggleBookmark: (eventSlug: string, eventTitle: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function loadApiProfile(): Promise<UserProfile | null> {
  try {
    const data = await api.dashboard();
    const registered = mapRegistrations(data.registeredEvents);
    const profile = apiUserToProfile(data.user, {
      registeredEvents: registered,
      registrationHistory: registered,
      upcomingReminders: data.reminders.map((r, i) => ({
        id: `rem-${i}`,
        title: r.title,
        when: r.when,
      })),
    });
    profile.bookmarkedEvents = data.bookmarks.map((b) => b.title);
    profile.savedResources = data.resources.map((r) => r.title);
    return profile;
  } catch {
    const me = await api.me();
    return apiUserToProfile(me.user);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<AuthTab>('login');
  const [authPortal, setAuthPortal] = useState<AuthPortal>('user');
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const dashboardIgnoreCloseRef = useRef(false);

  const firebaseReady = isFirebaseConfigured();
  const apiReady = isApiConfigured();
  const authMode: AuthMode = firebaseReady ? 'firebase' : 'local';
  const authReady = true;

  const applyLocalMemberSession = useCallback(
    (session: SessionUser, extras?: { department?: string; domainInterests?: DomainInterest[] }) => {
      setUser(session);
      const p = loadUserProfile(session.uid, session.email, session.displayName ?? '');
      if (extras?.department) p.department = extras.department;
      if (extras?.domainInterests?.length) p.domainInterests = extras.domainInterests;
      saveUserProfile(session.uid, p);
      setProfile(p);
    },
    []
  );

  const syncLocalProfile = useCallback((session: SessionUser) => {
    const p = loadUserProfile(session.uid, session.email, session.displayName ?? '');
    if (session.displayName && !p.displayName) p.displayName = session.displayName;
    saveUserProfile(session.uid, p);
    setProfile(p);
  }, []);

  const applyApiSession = useCallback(
    async (apiUser: ApiUser) => {
      const session = apiToSession(apiUser);
      setUser(session);
      const p = await loadApiProfile();
      if (p) setProfile(p);
      else syncLocalProfile(session);
    },
    [syncLocalProfile]
  );

  useEffect(() => {
    let cancelled = false;
    let unsubFirebase: (() => void) | undefined;

    (async () => {
      if (!apiReady && !firebaseReady) {
        ensureDemoAdminAccount();
      }

      if (!auth) {
        let hydrated = false;
        if (apiReady && getApiToken()) {
          try {
            const { user: apiUser } = await api.me();
            if (!cancelled) {
              await applyApiSession(apiUser);
              hydrated = true;
            }
          } catch {
            setApiToken(null);
          }
        }
        if (!hydrated && !cancelled) {
          const local = getLocalSession();
          if (local) {
            setUser(local);
            syncLocalProfile(local);
          }
        }
        if (!cancelled) setLoading(false);
        return;
      }

      unsubFirebase = onAuthStateChanged(auth, async (fbUser) => {
        if (cancelled) return;
        if (fbUser) {
          const session = firebaseToSession(fbUser);
          setUser(session);
          if (apiReady) {
            try {
              const idToken = await fbUser.getIdToken();
              const { user: apiUser, token } = await api.google(idToken);
              if (token) setApiToken(token);
              if (!cancelled) {
                await applyApiSession(apiUser);
              }
            } catch {
              if (!cancelled) syncLocalProfile(session);
            }
          } else if (!cancelled) {
            syncLocalProfile(session);
          }
        } else {
          const local = getLocalSession();
          if (local) {
            setUser(local);
            syncLocalProfile(local);
          } else {
            setUser(null);
            setProfile(null);
          }
        }
        if (!cancelled) setLoading(false);
      });
    })();

    return () => {
      cancelled = true;
      unsubFirebase?.();
    };
  }, [apiReady, firebaseReady, applyApiSession, syncLocalProfile]);

  const finishAuthSession = useCallback((session: SessionUser, portal: AuthPortal) => {
    if (portal === 'admin' && session.role !== 'admin') {
      throw new Error('This account does not have admin access. Try Member login or use admin credentials.');
    }
    setAuthOpen(false);
    if (portal === 'admin') {
      setDashboardOpen(false);
      setAdminOpen(true);
    } else {
      setAdminOpen(false);
      setDashboardOpen(true);
    }
  }, []);

  const openAuth = useCallback((tab: AuthTab = 'login', portal: AuthPortal = 'user') => {
    setAuthTab(tab);
    setAuthPortal(portal);
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => setAuthOpen(false), []);

  const openDashboard = useCallback(() => {
    dashboardIgnoreCloseRef.current = true;
    setDashboardOpen(true);
    window.setTimeout(() => {
      dashboardIgnoreCloseRef.current = false;
    }, 400);
  }, []);

  const closeDashboard = useCallback(() => {
    if (dashboardIgnoreCloseRef.current) return;
    setDashboardOpen(false);
  }, []);

  useEffect(() => {
    const onOpenDashboard = () => openDashboard();
    window.addEventListener('csi-open-dashboard', onOpenDashboard);
    return () => window.removeEventListener('csi-open-dashboard', onOpenDashboard);
  }, [openDashboard]);
  const openAdmin = useCallback(() => {
    setDashboardOpen(false);
    setAdminOpen(true);
  }, []);
  const closeAdmin = useCallback(() => setAdminOpen(false), []);

  const signIn = useCallback(
    async (email: string, password: string, remember: boolean) => {
      if (auth) {
        await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
        const session = firebaseToSession(cred.user);
        setUser(session);
        if (apiReady) {
          try {
            const idToken = await cred.user.getIdToken();
            const { user: apiUser, token } = await api.google(idToken);
            if (token) setApiToken(token);
            await applyApiSession(apiUser);
            finishAuthSession(apiToSession(apiUser), authPortal);
            return;
          } catch {
            syncLocalProfile(session);
          }
        }
        syncLocalProfile(session);
        finishAuthSession(session, authPortal);
        return;
      }
      if (apiReady) {
        const { user: apiUser, token } = await api.login(email.trim(), password);
        setApiToken(token);
        await applyApiSession(apiUser);
        finishAuthSession(apiToSession(apiUser), authPortal);
        return;
      }
      const session = localSignIn(email, password);
      applyLocalMemberSession(session);
      finishAuthSession(session, authPortal);
    },
    [applyLocalMemberSession, authPortal, finishAuthSession, syncLocalProfile]
  );

  const signUp = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      department: string,
      domainInterests: DomainInterest[]
    ) => {
      if (auth) {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(cred.user, { displayName: name.trim() });
        const p = loadUserProfile(cred.user.uid, email.trim(), name.trim());
        p.department = department;
        if (domainInterests.length) p.domainInterests = domainInterests;
        saveUserProfile(cred.user.uid, p);
        setProfile(p);
        if (apiReady) {
          try {
            const idToken = await cred.user.getIdToken();
            const { user: apiUser, token } = await api.google(idToken);
            if (token) setApiToken(token);
            await applyApiSession(apiUser);
            finishAuthSession(apiToSession(apiUser), 'user');
            return;
          } catch {
            /* local profile only */
          }
        }
        finishAuthSession(firebaseToSession(cred.user), 'user');
        return;
      }
      if (apiReady) {
        const { user: apiUser, token } = await api.signup({
          name,
          email,
          password,
          department,
          domainInterests,
        });
        setApiToken(token);
        await applyApiSession(apiUser);
        finishAuthSession(apiToSession(apiUser), 'user');
        return;
      }
      const session = localSignUp({
        name,
        email,
        password,
        department,
        domainInterests,
      });
      applyLocalMemberSession(session, { department, domainInterests });
      finishAuthSession(session, 'user');
    },
    [applyLocalMemberSession, finishAuthSession]
  );

  const signInGoogle = useCallback(async () => {
    if (!auth) {
      throw new Error('Google sign-in requires Firebase. Use email sign-up or configure Firebase in .env');
    }
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    let session = firebaseToSession(cred.user);
    if (apiReady) {
      const idToken = await cred.user.getIdToken();
      try {
        const { user: apiUser, token } = await api.google(idToken);
        if (token) setApiToken(token);
        await applyApiSession(apiUser);
        session = apiToSession(apiUser);
      } catch {
        setUser(session);
        syncLocalProfile(session);
      }
    } else {
      setUser(session);
      syncLocalProfile(session);
    }
    finishAuthSession(session, authPortal);
  }, [apiReady, applyApiSession, syncLocalProfile, authPortal, finishAuthSession]);

  const signOut = useCallback(async () => {
    localSignOut();
    setApiToken(null);
    setUser(null);
    setProfile(null);
    setDashboardOpen(false);
    setAdminOpen(false);
    if (auth) await firebaseSignOut(auth);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    if (authMode === 'local') {
      throw new Error('Password reset is not available in demo mode. Create a new account or configure Firebase.');
    }
    if (!auth) throw new Error('Password reset requires Firebase keys in .env');
    await sendPasswordResetEmail(auth, email.trim());
  }, [authMode]);

  const refreshProfile = useCallback(async () => {
    if (apiReady && (await hasApiSession())) {
      const p = await loadApiProfile();
      if (p) setProfile(p);
      return;
    }
    if (user) syncLocalProfile(user);
  }, [apiReady, user, syncLocalProfile]);

  const updateUserProfile = useCallback(
    (patch: Partial<UserProfile>) => {
      if (!user) return;
      const next = { ...loadUserProfile(user.uid, user.email, user.displayName ?? ''), ...patch };
      saveUserProfile(user.uid, next);
      setProfile(next);
    },
    [user]
  );

  const registerEvent = useCallback(
    (record: RegisteredEventRecord) => {
      if (!user) return;
      const next = addRegisteredEvent(user.uid, record);
      setProfile(next);
    },
    [user]
  );

  const toggleBookmark = useCallback(
    async (eventSlug: string, eventTitle: string): Promise<boolean> => {
      if (!user) return false;
      if (apiReady && (await hasApiSession())) {
        const { bookmarked } = await api.toggleBookmark(eventSlug);
        await refreshProfile();
        return bookmarked;
      }
      const next = toggleBookmarkedEvent(user.uid, eventTitle);
      setProfile(next);
      return next.bookmarkedEvents.includes(eventTitle);
    },
    [user, apiReady, refreshProfile]
  );

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      firebaseReady,
      apiReady,
      authMode,
      authReady,
      authOpen,
      authTab,
      authPortal,
      dashboardOpen,
      adminOpen,
      openAuth,
      setAuthPortal,
      closeAuth,
      openDashboard,
      closeDashboard,
      openAdmin,
      closeAdmin,
      signIn,
      signUp,
      signInGoogle,
      signOut,
      resetPassword,
      refreshProfile,
      updateUserProfile,
      registerEvent,
      toggleBookmark,
    }),
    [
      user,
      profile,
      loading,
      firebaseReady,
      apiReady,
      authMode,
      authReady,
      authOpen,
      authTab,
      authPortal,
      dashboardOpen,
      adminOpen,
      openAuth,
      setAuthPortal,
      closeAuth,
      openDashboard,
      closeDashboard,
      openAdmin,
      closeAdmin,
      signIn,
      signUp,
      signInGoogle,
      signOut,
      resetPassword,
      refreshProfile,
      updateUserProfile,
      registerEvent,
      toggleBookmark,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function dispatchOpenNova(): void {
  window.dispatchEvent(new CustomEvent('csi-open-nova'));
}

export function dispatchOpenDashboard(): void {
  window.dispatchEvent(new CustomEvent('csi-open-dashboard'));
}
