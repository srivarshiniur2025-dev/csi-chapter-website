import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
  getApiToken,
  isApiConfigured,
  mapRegistrations,
  setApiToken,
  type ApiUser,
} from '../lib/api';
import {
  addRegisteredEvent,
  loadUserProfile,
  saveUserProfile,
  type DomainInterest,
  type RegisteredEventRecord,
  type UserProfile,
} from '../lib/userDashboard';

export type AuthTab = 'login' | 'signup';

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
  authOpen: boolean;
  authTab: AuthTab;
  dashboardOpen: boolean;
  adminOpen: boolean;
  openAuth: (tab?: AuthTab) => void;
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
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const firebaseReady = isFirebaseConfigured();
  const apiReady = isApiConfigured();

  const syncLocalProfile = useCallback((session: SessionUser) => {
    const p = loadUserProfile(session.uid, session.email, session.displayName ?? '');
    if (session.displayName && !p.displayName) p.displayName = session.displayName;
    saveUserProfile(session.uid, p);
    setProfile(p);
  }, []);

  const applyApiSession = useCallback(async (apiUser: ApiUser, token: string) => {
    setApiToken(token);
    const session = apiToSession(apiUser);
    setUser(session);
    const p = await loadApiProfile();
    if (p) setProfile(p);
    else syncLocalProfile(session);
  }, [syncLocalProfile]);

  useEffect(() => {
    let cancelled = false;
    let unsubFirebase: (() => void) | undefined;

    (async () => {
      if (apiReady && getApiToken()) {
        try {
          const { user: apiUser } = await api.me();
          if (!cancelled) {
            setUser(apiToSession(apiUser));
            const p = await loadApiProfile();
            if (!cancelled) setProfile(p ?? apiUserToProfile(apiUser));
          }
        } catch {
          setApiToken(null);
        }
      }

      if (!auth) {
        if (!cancelled) setLoading(false);
        return;
      }

      unsubFirebase = onAuthStateChanged(auth, (fbUser) => {
        if (cancelled) return;
        if (apiReady && getApiToken()) {
          setLoading(false);
          return;
        }
        if (fbUser) {
          setUser(firebaseToSession(fbUser));
          syncLocalProfile(firebaseToSession(fbUser));
        } else if (!getApiToken()) {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      });
    })();

    return () => {
      cancelled = true;
      unsubFirebase?.();
    };
  }, [apiReady, syncLocalProfile]);

  const openAuth = useCallback((tab: AuthTab = 'login') => {
    setAuthTab(tab);
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => setAuthOpen(false), []);
  const openDashboard = useCallback(() => setDashboardOpen(true), []);
  const closeDashboard = useCallback(() => setDashboardOpen(false), []);
  const openAdmin = useCallback(() => {
    setDashboardOpen(false);
    setAdminOpen(true);
  }, []);
  const closeAdmin = useCallback(() => setAdminOpen(false), []);

  const signIn = useCallback(
    async (email: string, password: string, remember: boolean) => {
      if (apiReady) {
        const { token, user: apiUser } = await api.login(email, password);
        setApiToken(token);
        await applyApiSession(apiUser, token);
        setAuthOpen(false);
        setDashboardOpen(true);
        return;
      }
      if (!auth) throw new Error('Configure VITE_API_URL or Firebase keys in .env');
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setAuthOpen(false);
      setDashboardOpen(true);
    },
    [apiReady, applyApiSession]
  );

  const signUp = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      department: string,
      domainInterests: DomainInterest[]
    ) => {
      if (apiReady) {
        const { token, user: apiUser } = await api.signup({
          name,
          email,
          password,
          department,
          domainInterests,
        });
        await applyApiSession(apiUser, token);
        setAuthOpen(false);
        setDashboardOpen(true);
        return;
      }
      if (!auth) throw new Error('Configure VITE_API_URL or Firebase keys in .env');
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(cred.user, { displayName: name.trim() });
      const p = loadUserProfile(cred.user.uid, email.trim(), name.trim());
      p.department = department;
      if (domainInterests.length) p.domainInterests = domainInterests;
      saveUserProfile(cred.user.uid, p);
      setProfile(p);
      setAuthOpen(false);
      setDashboardOpen(true);
    },
    [apiReady, applyApiSession]
  );

  const signInGoogle = useCallback(async () => {
    if (!auth && !apiReady) throw new Error('Configure VITE_API_URL or Firebase keys in .env');
    if (!auth) throw new Error('Google sign-in requires Firebase keys in .env');
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    if (apiReady) {
      const idToken = await cred.user.getIdToken();
      try {
        const { token, user: apiUser } = await api.google(idToken);
        await applyApiSession(apiUser, token);
      } catch {
        const session = firebaseToSession(cred.user);
        setUser(session);
        syncLocalProfile(session);
      }
    }
    setAuthOpen(false);
    setDashboardOpen(true);
  }, [apiReady, applyApiSession, syncLocalProfile]);

  const signOut = useCallback(async () => {
    setApiToken(null);
    setUser(null);
    setProfile(null);
    setDashboardOpen(false);
    setAdminOpen(false);
    if (auth) await firebaseSignOut(auth);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    if (!auth) throw new Error('Password reset requires Firebase keys in .env');
    await sendPasswordResetEmail(auth, email.trim());
  }, []);

  const refreshProfile = useCallback(async () => {
    if (apiReady && getApiToken()) {
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

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      firebaseReady,
      apiReady,
      authOpen,
      authTab,
      dashboardOpen,
      adminOpen,
      openAuth,
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
    }),
    [
      user,
      profile,
      loading,
      firebaseReady,
      apiReady,
      authOpen,
      authTab,
      dashboardOpen,
      adminOpen,
      openAuth,
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
