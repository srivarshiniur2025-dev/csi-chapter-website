import type { ChapterEvent } from '../components/Events';

export type EventTimeFilter = 'upcoming' | 'past' | 'all';

export const EVENT_CATEGORY_FILTERS = [
  'All',
  'Workshop',
  'Hackathon',
  'Web Development',
  'AI/ML',
  'Competitive Programming',
  'Robotics',
] as const;

export type EventCategoryFilter = (typeof EVENT_CATEGORY_FILTERS)[number];

export function isEventUpcoming(startISO: string): boolean {
  const t = new Date(startISO).getTime();
  return !Number.isNaN(t) && t >= Date.now() - 24 * 60 * 60 * 1000;
}

export function filterEventsByTime(events: ChapterEvent[], filter: EventTimeFilter): ChapterEvent[] {
  if (filter === 'all') return events;
  if (filter === 'upcoming') return events.filter((e) => isEventUpcoming(e.startISO));
  return events.filter((e) => !isEventUpcoming(e.startISO));
}

export function searchEvents(events: ChapterEvent[], query: string): ChapterEvent[] {
  const q = query.trim().toLowerCase();
  if (!q) return events;
  return events.filter(
    (e) =>
      e.title.toLowerCase().includes(q) ||
      e.label.toLowerCase().includes(q) ||
      e.venue.toLowerCase().includes(q) ||
      e.shortDescription.toLowerCase().includes(q)
  );
}

export function filterEventsByCategory(
  events: ChapterEvent[],
  category: EventCategoryFilter
): ChapterEvent[] {
  if (category === 'All') return events;
  const needle = category.toLowerCase();
  return events.filter((e) => {
    const label = e.label.toLowerCase();
    if (needle === 'ai/ml') return label.includes('ai') || label.includes('ml');
    if (needle === 'web development') return label.includes('web');
    if (needle === 'competitive programming') return label.includes('competitive') || label.includes('algo');
    return label.includes(needle);
  });
}

export function getSpotsLeft(event: ChapterEvent): number {
  const taken = event.seatsTaken ?? 0;
  return Math.max(0, event.totalSeats - taken);
}

export function getFeaturedEvents(events: ChapterEvent[]): ChapterEvent[] {
  return events.filter((e) => e.featured);
}

export type EventStatus = 'upcoming' | 'soon' | 'past' | 'sold-out';

export function getEventStatus(event: ChapterEvent): EventStatus {
  if (getSpotsLeft(event) === 0) return 'sold-out';
  if (!isEventUpcoming(event.startISO)) return 'past';
  const ms = new Date(event.startISO).getTime() - Date.now();
  if (ms >= 0 && ms <= 7 * 24 * 60 * 60 * 1000) return 'soon';
  return 'upcoming';
}

export function getEventStatusLabel(status: EventStatus): string {
  switch (status) {
    case 'sold-out':
      return 'Sold out';
    case 'past':
      return 'Completed';
    case 'soon':
      return 'Starting soon';
    default:
      return 'Open';
  }
}

export function sortEventsByDate(events: ChapterEvent[], direction: 'asc' | 'desc' = 'asc'): ChapterEvent[] {
  return [...events].sort((a, b) => {
    const ta = new Date(a.startISO).getTime();
    const tb = new Date(b.startISO).getTime();
    return direction === 'asc' ? ta - tb : tb - ta;
  });
}
