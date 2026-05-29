import { auth, isFirebaseConfigured } from './firebase';
import type { DomainInterest, UserProfile, RegisteredEventRecord } from './userDashboard';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || '';

export function isApiConfigured(): boolean {
  return Boolean(API_URL);
}

/** True when the API is configured and the user has a Firebase session for Bearer auth */
export async function hasApiSession(): Promise<boolean> {
  if (!isApiConfigured() || !isFirebaseConfigured() || !auth?.currentUser) return false;
  return true;
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
  featured?: boolean;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function attachAuthHeader(headers: Record<string, string>) {
  if (!isFirebaseConfigured() || !auth?.currentUser) return;
  const idToken = await auth.currentUser.getIdToken();
  headers.Authorization = `Bearer ${idToken}`;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  authRequired = true
): Promise<T> {
  if (!API_URL) throw new Error('API URL not configured');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (authRequired) {
    await attachAuthHeader(headers);
    if (!headers.Authorization) {
      throw new ApiError('Sign in with Firebase to use cloud features', 401);
    }
  }
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError(
      'Cannot reach the CSI API. If you are on the live site, deploy the server or remove VITE_API_URL until it is ready.',
      0
    );
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(data.message || res.statusText || 'Request failed', res.status);
  }
  return data as T;
}

export const api = {
  google(idToken: string) {
    return request<{ user: ApiUser }>('/api/auth/google', {
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
      analytics: {
        users: number;
        events: number;
        registrations: number;
        announcements: number;
        activeUsers?: number;
        certificates?: number;
      };
      registrationTrend: Array<{ label: string; count: number }>;
      topEvents: Array<{ title: string; count: number }>;
      recentRegistrations: unknown[];
    }>('/api/admin/analytics');
  },

  resources() {
    return request<{
      resources: Array<{
        _id: string;
        title: string;
        description: string;
        category: string;
        url?: string;
      }>;
    }>('/api/resources', {}, false);
  },

  adminResources() {
    return request<{
      resources: Array<{
        _id: string;
        title: string;
        description: string;
        category: string;
        url?: string;
      }>;
    }>('/api/admin/resources');
  },

  projects() {
    return request<{ projects: ApiProject[] }>('/api/projects', {}, false);
  },

  adminProjects() {
    return request<{ projects: ApiProject[] }>('/api/admin/projects');
  },

  adminCreateProject(body: Record<string, unknown>) {
    return request<{ project: ApiProject }>('/api/admin/projects', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  adminUpdateProject(slug: string, body: Record<string, unknown>) {
    return request<{ project: ApiProject }>(`/api/admin/projects/${slug}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  adminDeleteProject(slug: string) {
    return request(`/api/admin/projects/${slug}`, { method: 'DELETE' });
  },

  adminUpdateResource(id: string, body: Record<string, unknown>) {
    return request(`/api/admin/resources/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  adminDeleteResource(id: string) {
    return request(`/api/admin/resources/${id}`, { method: 'DELETE' });
  },

  adminSendNotification(body: { title: string; message: string; type?: string }) {
    return request<{ sent: number }>('/api/admin/notifications', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  adminPatchRegistration(id: string, body: { status?: string; attended?: boolean }) {
    return request(`/api/admin/registrations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  adminCertificates() {
    return request<{ certificates: ApiCertificate[] }>('/api/admin/certificates');
  },

  adminCreateResource(body: {
    title: string;
    description?: string;
    category?: string;
    url?: string;
  }) {
    return request<{ resource: { _id: string; title: string } }>('/api/admin/resources', {
      method: 'POST',
      body: JSON.stringify(body),
    });
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
        status?: string;
        attended?: boolean;
        event: ApiEvent | null;
        createdAt: string;
      }>;
      certificates?: ApiCertificate[];
      bookmarks: ApiEvent[];
      resources: Array<{ title: string; description: string; category: string }>;
      announcements: Array<{ title: string; body: string }>;
      notifications: Array<{
        _id: string;
        title: string;
        message: string;
        type?: string;
        read?: boolean;
      }>;
      reminders: Array<{ title: string; when: string; venue: string }>;
    }>('/api/dashboard');
  },

  toggleBookmark(slug: string) {
    return request<{ bookmarked: boolean }>(`/api/dashboard/bookmarks/${slug}`, {
      method: 'POST',
    });
  },

  toggleResourceSave(resourceId: string) {
    return request<{ saved: boolean; savedResources: string[] }>('/api/dashboard/resources/save', {
      method: 'POST',
      body: JSON.stringify({ resourceId }),
    });
  },

  markNotificationRead(id: string) {
    return request(`/api/dashboard/notifications/${id}/read`, { method: 'PATCH' });
  },

  assistantChat(message: string) {
    return request<{ reply: string; scrollTo?: string }>('/api/assistant/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }, false);
  },

  gallery(category?: string) {
    const q = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    return request<{ items: GalleryApiItem[] }>(`/api/gallery${q}`, {}, false);
  },

  adminUsers() {
    return request<{ users: ApiUser[] }>('/api/admin/users');
  },

  adminRegistrations() {
    return request<{ registrations: AdminRegistration[] }>('/api/admin/registrations');
  },

  adminAnnouncements() {
    return request<{ announcements: AnnouncementItem[] }>('/api/admin/announcements');
  },

  adminCreateAnnouncement(body: { title: string; body: string; audience?: string }) {
    return request<{ announcement: AnnouncementItem }>('/api/admin/announcements', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  adminDeleteAnnouncement(id: string) {
    return request(`/api/admin/announcements/${id}`, { method: 'DELETE' });
  },

  adminCreateEvent(body: Record<string, unknown>) {
    return request<{ event: ApiEvent }>('/api/events', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  adminUpdateEvent(slug: string, body: Record<string, unknown>) {
    return request<{ event: ApiEvent }>(`/api/events/${slug}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  adminDeleteEvent(slug: string) {
    return request(`/api/events/${slug}`, { method: 'DELETE' });
  },

  adminGallery(all = true) {
    return request<{ items: GalleryApiItem[] }>(`/api/gallery?all=${all ? '1' : '0'}`);
  },

  adminCreateGalleryItem(body: {
    title: string;
    category: string;
    imageUrl: string;
    caption?: string;
  }) {
    return request<{ item: GalleryApiItem }>('/api/gallery', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  adminDeleteGalleryItem(id: string) {
    return request(`/api/gallery/${id}`, { method: 'DELETE' });
  },
};

export interface GalleryApiItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  caption: string;
}

export interface AnnouncementItem {
  _id: string;
  title: string;
  body: string;
  isPublished?: boolean;
}

export interface AdminRegistration {
  _id?: string;
  registrationId?: string;
  status?: string;
  attended?: boolean;
  user?: { name?: string; email?: string };
  event?: { title?: string; slug?: string };
  createdAt?: string;
}

export interface ApiProject {
  id: string;
  title: string;
  description: string;
  domain: string;
  stack: string[];
  github?: string;
  demo?: string;
  category: string;
  featured?: boolean;
}

export interface ApiCertificate {
  _id: string;
  registrationId: string;
  eventTitle: string;
  memberName: string;
  verifyCode: string;
  issuedAt: string;
}

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
    achievements: user.achievements || [],
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
