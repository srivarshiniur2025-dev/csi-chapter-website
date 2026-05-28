import type { DomainInterest } from './userDashboard';

export interface LocalSession {
  uid: string;
  email: string;
  displayName: string | null;
  role: string;
}

const USERS_KEY = 'csi-local-users';
const SESSION_KEY = 'csi-local-session';

interface LocalUserRecord {
  uid: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'user' | 'admin';
  department: string;
  domainInterests: DomainInterest[];
}

function hashPassword(password: string, email: string): string {
  return btoa(`${email.toLowerCase()}:${password}`);
}

function loadUsers(): LocalUserRecord[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as LocalUserRecord[]) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: LocalUserRecord[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function toSession(record: LocalUserRecord): LocalSession {
  return {
    uid: record.uid,
    email: record.email,
    displayName: record.name,
    role: record.role,
  };
}

export function isLocalAuthAvailable(): boolean {
  return typeof window !== 'undefined';
}

export function getLocalSession(): LocalSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const { uid } = JSON.parse(raw) as { uid: string };
    const user = loadUsers().find((u) => u.uid === uid);
    return user ? toSession(user) : null;
  } catch {
    return null;
  }
}

export function localSignUp(params: {
  name: string;
  email: string;
  password: string;
  department: string;
  domainInterests: DomainInterest[];
}): LocalSession {
  const email = params.email.trim().toLowerCase();
  const users = loadUsers();
  if (users.some((u) => u.email === email)) {
    throw new Error('An account with this email already exists.');
  }
  const isAdmin = email === 'admin@csi.vitc.edu';
  const record: LocalUserRecord = {
    uid: `local-${Date.now().toString(36)}`,
    email,
    passwordHash: hashPassword(params.password, email),
    name: params.name.trim(),
    role: isAdmin ? 'admin' : 'user',
    department: params.department,
    domainInterests: params.domainInterests,
  };
  users.push(record);
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, JSON.stringify({ uid: record.uid }));
  return toSession(record);
}

export function localSignIn(email: string, password: string): LocalSession {
  const normalized = email.trim().toLowerCase();
  const user = loadUsers().find((u) => u.email === normalized);
  if (!user || user.passwordHash !== hashPassword(password, normalized)) {
    throw new Error('Invalid email or password.');
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify({ uid: user.uid }));
  return toSession(user);
}

export function localSignOut(): void {
  localStorage.removeItem(SESSION_KEY);
}
