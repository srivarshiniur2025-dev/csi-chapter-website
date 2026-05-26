/** Client-side registration helpers (demo — no backend). */

const SEATS_STORAGE_KEY = 'csi-event-seats-taken';

export interface RegistrationFormData {
  name: string;
  email: string;
  domain: string;
  yearDept: string;
  message: string;
}

export function getBaseSeatsTaken(eventId: string): number {
  let h = 0;
  for (let i = 0; i < eventId.length; i++) h = (h * 31 + eventId.charCodeAt(i)) >>> 0;
  return 8 + (h % 24);
}

export function getSeatsTaken(eventId: string): number {
  if (typeof window === 'undefined') return getBaseSeatsTaken(eventId);
  try {
    const raw = localStorage.getItem(SEATS_STORAGE_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    return map[eventId] ?? getBaseSeatsTaken(eventId);
  } catch {
    return getBaseSeatsTaken(eventId);
  }
}

export function recordSeatTaken(eventId: string): number {
  const next = getSeatsTaken(eventId) + 1;
  try {
    const raw = localStorage.getItem(SEATS_STORAGE_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    map[eventId] = next;
    localStorage.setItem(SEATS_STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
  return next;
}

export function generateRegistrationId(eventId: string): string {
  const slug = eventId.toUpperCase().replace(/-/g, '').slice(0, 4);
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CSI-${slug}-${stamp}${rand}`;
}

export function parseEventStart(iso: string): Date {
  return new Date(iso);
}

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export function getCountdown(target: Date, now = new Date()): CountdownParts {
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }
  const seconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
    isPast: false,
  };
}

export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** Deterministic faux-QR grid from registration id */
export function buildPassMatrix(id: string, size = 21): boolean[][] {
  const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  let seed = 0;
  for (let i = 0; i < id.length; i++) seed = (seed * 33 + id.charCodeAt(i)) >>> 0;

  const set = (r: number, c: number, v: boolean) => {
    if (r >= 0 && r < size && c >= 0 && c < size) grid[r][c] = v;
  };

  const fillFinder = (r0: number, c0: number) => {
    for (let r = r0; r < r0 + 7; r++) {
      for (let c = c0; c < c0 + 7; c++) {
        const edge = r === r0 || r === r0 + 6 || c === c0 || c === c0 + 6;
        const inner = r >= r0 + 2 && r <= r0 + 4 && c >= c0 + 2 && c <= c0 + 4;
        set(r, c, edge || inner);
      }
    }
  };

  fillFinder(0, 0);
  fillFinder(0, size - 7);
  fillFinder(size - 7, 0);

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (
        (r < 8 && c < 8) ||
        (r < 8 && c >= size - 8) ||
        (r >= size - 8 && c < 8)
      ) {
        continue;
      }
      seed = (seed * 1103515245 + 12345) >>> 0;
      set(r, c, (seed & 0xffff) % 3 !== 0);
    }
  }
  return grid;
}

export function downloadICS(options: {
  title: string;
  description: string;
  location: string;
  startISO: string;
  durationHours?: number;
}): void {
  const start = parseEventStart(options.startISO);
  const end = new Date(start.getTime() + (options.durationHours ?? 3) * 3600000);
  const fmt = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '');

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CSI VITC//Event Registration//EN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@csi-vitc`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${options.title.replace(/,/g, '\\,')}`,
    `DESCRIPTION:${options.description.replace(/,/g, '\\,').replace(/\n/g, '\\n')}`,
    `LOCATION:${options.location.replace(/,/g, '\\,')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${options.title.replace(/\s+/g, '-')}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

export const DOMAIN_OPTIONS = [
  'AI / Machine Learning',
  'Web Development',
  'Robotics',
  'Cybersecurity',
  'Competitive Programming',
  'Cloud & DevOps',
  'Open Source',
];

export const YEAR_DEPT_OPTIONS = [
  '1st Year — CSE',
  '1st Year — IT',
  '1st Year — ECE',
  '2nd Year — CSE',
  '2nd Year — IT',
  '2nd Year — ECE',
  '3rd Year — CSE',
  '3rd Year — IT',
  '3rd Year — ECE',
  '4th Year — CSE',
  '4th Year — IT',
  '4th Year — ECE',
  'Other',
];
