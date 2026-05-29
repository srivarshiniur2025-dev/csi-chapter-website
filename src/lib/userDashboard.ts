export const DOMAIN_INTEREST_OPTIONS = [
  'AI / ML',
  'Web Development',
  'Robotics',
  'Competitive Programming',
  'Cybersecurity',
  'Open Source',
] as const;

export const DEPARTMENT_OPTIONS = [
  'CSE',
  'IT',
  'ECE',
  'EEE',
  'Mechanical',
  'Civil',
  'Biotech',
  'M.Tech / PG',
  'Other',
] as const;

export type DomainInterest = (typeof DOMAIN_INTEREST_OPTIONS)[number];

export interface UserProfile {
  displayName: string;
  email: string;
  department: string;
  domainInterests: DomainInterest[];
  savedResources: string[];
  bookmarkedEvents: string[];
  registeredEvents: RegisteredEventRecord[];
  registrationHistory: RegisteredEventRecord[];
  achievements: string[];
  upcomingReminders: ReminderRecord[];
}

export interface RegisteredEventRecord {
  id: string;
  eventId: string;
  eventTitle: string;
  registrationId: string;
  registeredAt: string;
  eventDate?: string;
}

export interface ReminderRecord {
  id: string;
  title: string;
  when: string;
}

const profileKey = (uid: string) => `csi-user-profile-${uid}`;

/** Platform resources shown in the dashboard before the member saves any */
export const PLATFORM_RESOURCE_SUGGESTIONS = [
  'CSI Nova AI Guide',
  'Web Dev Starter Kit',
  'Python for Beginners',
  'Hackathon Prep Checklist',
];

export function getDefaultProfile(email: string, displayName = ''): UserProfile {
  return {
    displayName,
    email,
    department: '',
    domainInterests: [],
    savedResources: [],
    bookmarkedEvents: [],
    registeredEvents: [],
    registrationHistory: [],
    achievements: [],
    upcomingReminders: [],
  };
}

export function loadUserProfile(uid: string, email: string, displayName?: string): UserProfile {
  if (typeof window === 'undefined') return getDefaultProfile(email, displayName ?? '');
  try {
    const raw = localStorage.getItem(profileKey(uid));
    if (!raw) return getDefaultProfile(email, displayName ?? '');
    const parsed = JSON.parse(raw) as UserProfile;
    return {
      ...getDefaultProfile(email, displayName ?? parsed.displayName),
      ...parsed,
      email,
    };
  } catch {
    return getDefaultProfile(email, displayName ?? '');
  }
}

export function saveUserProfile(uid: string, profile: UserProfile): void {
  try {
    localStorage.setItem(profileKey(uid), JSON.stringify(profile));
  } catch {
    /* ignore */
  }
}

export function addRegisteredEvent(uid: string, record: RegisteredEventRecord): UserProfile {
  const profile = loadUserProfile(uid, '');
  const exists = profile.registeredEvents.some((e) => e.registrationId === record.registrationId);
  if (!exists) {
    profile.registeredEvents.unshift(record);
    profile.registrationHistory.unshift(record);
    profile.upcomingReminders.unshift({
      id: record.id,
      title: `${record.eventTitle} reminder`,
      when: record.eventDate ?? record.registeredAt,
    });

    if (profile.registeredEvents.length >= 1 && !profile.achievements.includes('First Registration')) {
      profile.achievements.push('First Registration');
    }
    if (profile.registeredEvents.length >= 3 && !profile.achievements.includes('Event Enthusiast')) {
      profile.achievements.push('Event Enthusiast');
    }
  }
  saveUserProfile(uid, profile);
  return profile;
}

export function toggleSavedResource(uid: string, resourceTitle: string): UserProfile {
  const profile = loadUserProfile(uid, '');
  if (profile.savedResources.includes(resourceTitle)) {
    profile.savedResources = profile.savedResources.filter((r) => r !== resourceTitle);
  } else {
    profile.savedResources.unshift(resourceTitle);
  }
  saveUserProfile(uid, profile);
  return profile;
}

export function toggleBookmarkedEvent(uid: string, eventTitle: string): UserProfile {
  const profile = loadUserProfile(uid, '');
  if (profile.bookmarkedEvents.includes(eventTitle)) {
    profile.bookmarkedEvents = profile.bookmarkedEvents.filter((e) => e !== eventTitle);
  } else {
    profile.bookmarkedEvents.unshift(eventTitle);
  }
  saveUserProfile(uid, profile);
  return profile;
}
