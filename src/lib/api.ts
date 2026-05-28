import type { DomainInterest, UserProfile, RegisteredEventRecord } from './userDashboard';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || '';
const TOKEN_KEY = 'csi-api-token';

export function isApiConfigured(): boolean {
  return Boolean(API_URL);
}

export function getApiToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setApiToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  domainInterests: string[];
  bookmarkedEvents: string[];
  savedResources: string[];
  achievements: string[];
}

export interface ApiEvent {
  id: string;
  title: string;
  date: string;
  venue: string;
  label: string;
  image: string;
  imageAlt: string;
  shortDescription: string;
  fullDescription: string;
  startISO: string;
  totalSeats: number;
  seatsTaken: number;
  spotsLeft: number;
  speaker: { name: string; role: string };
  techIcons: string[];
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = true
): Promise<T> {
  if (!API_URL) throw new Error('API URL not configured');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (auth) {
    const token = getApiToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(data.message || res.statusText || 'Request failed', res.status);
  }
  return data as T;
}

export const api = {
  signup(body: {
    name: string;
    email: string;
    password: string;
    department?: string;
    domainInterests?: DomainInterest[];
  }) {
    return request<{ token: string; user: ApiUser }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(body),
    }, false);
  },

  login(email: string, password: string) {
    return request<{ token: string; user: ApiUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, false);
  },

  google(idToken: string) {
    return request<{ token: string; user: ApiUser }>('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    }, false);
  },

  me() {
    return request<{ user: ApiUser }>('/api/auth/me');
  },

  updateProfile(body: { name?: string; department?: string; domainInterests?: string[] }) {
    return request<{ user: ApiUser }>('/api/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  adminAnalytics() {
    return request<{
      analytics: { users: number; events: number; registrations: number; announcements: number };
      recentRegistrations: unknown[];
    }>('/api/admin/analytics');
  },

  events() {
    return request<{ events: ApiEvent[] }>('/api/events', {}, false);
  },

  registerEvent(slug: string, form: Record<string, string>) {
    return request<{ registration: { registrationId: string; event: ApiEvent } }>(
      `/api/registrations/events/${slug}`,
      { method: 'POST', body: JSON.stringify({ form }) }
    );
  },

  dashboard() {
    return request<{
      user: ApiUser;
      stats: { eventsRegistered: number; bookmarks: number; achievements: number };
      registeredEvents: Array<{
        registrationId: string;
        event: ApiEvent | null;
        createdAt: string;
      }>;
      bookmarks: ApiEvent[];
      resources: Array<{ title: string; description: string; category: string }>;
      announcements: Array<{ title: string; body: string }>;
      reminders: Array<{ title: string; when: string; venue: string }>;
    }>('/api/dashboard');
  },

  assistantChat(message: string) {
    return request<{ reply: string }>('/api/assistant/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }, false);
  },
};

export function apiUserToProfile(user: ApiUser, extra?: Partial<UserProfile>): UserProfile {
  return {
    displayName: user.name,
    email: user.email,
    department: user.department,
    domainInterests: (user.domainInterests || []) as DomainInterest[],
    savedResources: user.savedResources || [],
    bookmarkedEvents: [],
    registeredEvents: extra?.registeredEvents ?? [],
    registrationHistory: extra?.registrationHistory ?? [],
    achievements: user.achievements || ['Explorer Badge'],
    upcomingReminders: extra?.upcomingReminders ?? [],
  };
}

export function mapRegistrations(
  items: Array<{ registrationId: string; event: ApiEvent | null; createdAt: string }>
): RegisteredEventRecord[] {
  return items
    .filter((r) => r.event)
    .map((r) => ({
      id: r.registrationId,
      eventId: r.event!.id,
      eventTitle: r.event!.title,
      registrationId: r.registrationId,
      registeredAt: r.createdAt,
      eventDate: r.event!.startISO,
    }));
}
