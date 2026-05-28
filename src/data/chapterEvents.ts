/** Slim event catalog for dashboard recommendations (full UI data lives in Events.tsx) */
export interface EventCatalogItem {
  id: string;
  title: string;
  date: string;
  label: string;
  startISO: string;
  shortDescription: string;
}

export const CHAPTER_EVENTS_CATALOG: EventCatalogItem[] = [
  {
    id: 'algox',
    title: 'AlgoX Arena',
    date: 'January 30, 2026',
    label: 'Competitive Programming',
    startISO: '2026-01-30T14:00:00+05:30',
    shortDescription: 'Level up algorithmic thinking through high-intensity contests.',
  },
  {
    id: 'webverse',
    title: 'WebVerse Bootcamp',
    date: 'February 22, 2026',
    label: 'Web Development',
    startISO: '2026-02-22T10:00:00+05:30',
    shortDescription: 'Master modern frontends, motion design, and immersive web experiences.',
  },
  {
    id: 'ai-nexus',
    title: 'AI Nexus Workshop',
    date: 'March 18, 2026',
    label: 'AI/ML Workshop',
    startISO: '2026-03-18T09:30:00+05:30',
    shortDescription: 'Hands-on ML pipelines, intelligent agents, and real-world AI deployment.',
  },
  {
    id: 'codestorm',
    title: 'CodeStorm Hackathon',
    date: 'April 2–3, 2026',
    label: 'Hackathon',
    startISO: '2026-04-02T18:00:00+05:30',
    shortDescription: 'A 24-hour innovation sprint building impactful products.',
  },
  {
    id: 'robofusion',
    title: 'RoboFusion Challenge',
    date: 'May 8, 2026',
    label: 'Robotics',
    startISO: '2026-05-08T09:00:00+05:30',
    shortDescription: 'Design autonomous systems with sensors and intelligent control.',
  },
];
