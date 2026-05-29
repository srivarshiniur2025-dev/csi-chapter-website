import type { ChapterEvent } from '../components/Events';

export type EventTimeFilter = 'upcoming' | 'past' | 'all';

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

export function getSpotsLeft(event: ChapterEvent): number {
  const taken = event.seatsTaken ?? 0;
  return Math.max(0, event.totalSeats - taken);
}
