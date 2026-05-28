import type { DomainInterest } from './userDashboard';
import type { EventCatalogItem } from '../data/chapterEvents';

const INTEREST_TO_LABELS: Record<string, string[]> = {
  'AI / ML': ['AI', 'ML', 'Machine'],
  'Web Development': ['Web'],
  Robotics: ['Robotics', 'Robo'],
  'Competitive Programming': ['Competitive', 'Algo', 'Programming'],
  Cybersecurity: ['Cyber', 'Security'],
  'Open Source': ['Open', 'Hackathon', 'Code'],
};

export function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function getMemberTier(registeredCount: number): {
  label: string;
  progress: number;
  nextLabel: string;
} {
  if (registeredCount >= 5) {
    return { label: 'Chapter Champion', progress: 100, nextLabel: 'Max tier' };
  }
  if (registeredCount >= 3) {
    return { label: 'Active Member', progress: 60 + registeredCount * 8, nextLabel: 'Chapter Champion at 5 events' };
  }
  if (registeredCount >= 1) {
    return { label: 'Explorer', progress: 25 + registeredCount * 15, nextLabel: 'Active Member at 3 events' };
  }
  return { label: 'New Member', progress: 8, nextLabel: 'Explorer — register for your first event' };
}

export function getRecommendedEvents(
  interests: DomainInterest[],
  catalog: EventCatalogItem[],
  registeredIds: string[],
  limit = 3
): EventCatalogItem[] {
  const now = Date.now();
  const upcoming = catalog
    .filter((e) => new Date(e.startISO).getTime() >= now - 86400000)
    .sort((a, b) => new Date(a.startISO).getTime() - new Date(b.startISO).getTime());

  const keywords = interests.flatMap((i) => INTEREST_TO_LABELS[i] ?? [i]);

  const scored = upcoming.map((event) => {
    if (registeredIds.includes(event.id)) return { event, score: -1 };
    let score = 0;
    const hay = `${event.title} ${event.label} ${event.shortDescription}`.toLowerCase();
    for (const kw of keywords) {
      if (hay.includes(kw.toLowerCase())) score += 2;
    }
    return { event, score };
  });

  return scored
    .filter((s) => s.score >= 0)
    .sort((a, b) => b.score - a.score || new Date(a.event.startISO).getTime() - new Date(b.event.startISO).getTime())
    .slice(0, limit)
    .map((s) => s.event);
}

export function formatEventCountdown(startISO: string): string {
  const diff = new Date(startISO).getTime() - Date.now();
  if (diff < 0) return 'Started';
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `In ${days} day${days === 1 ? '' : 's'}`;
  const hours = Math.floor(diff / 3600000);
  if (hours > 0) return `In ${hours}h`;
  return 'Soon';
}
