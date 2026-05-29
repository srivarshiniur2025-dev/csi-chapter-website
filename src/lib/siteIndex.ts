import { CHAPTER_EVENTS_CATALOG } from '../data/chapterEvents';
import {
  ACHIEVEMENTS,
  PLATFORM_JOURNEY,
  PUBLIC_RESOURCES,
  SHOWCASE_PROJECTS,
} from './platformContent';

export type SiteIndexItem = {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Section' | 'Event' | 'Resource' | 'Project' | 'Achievement' | 'Action';
  target: string;
  keywords: string[];
};

const SECTIONS: SiteIndexItem[] = [
  { id: 'home', title: 'Home', category: 'Section', target: 'home', keywords: ['hero', 'start', 'csi'] },
  { id: 'about', title: 'About CSI', category: 'Section', target: 'about', keywords: ['chapter', 'mission', 'vit'] },
  { id: 'platform', title: 'Platform Guide', category: 'Section', target: 'platform', keywords: ['join', 'how', 'guide', 'faq'] },
  { id: 'events', title: 'Events', category: 'Section', target: 'events', keywords: ['hackathon', 'workshop', 'register'] },
  { id: 'projects', title: 'Projects', category: 'Section', target: 'projects', keywords: ['showcase', 'github', 'build'] },
  { id: 'achievements', title: 'Achievements', category: 'Section', target: 'achievements', keywords: ['wins', 'awards', 'milestones'] },
  { id: 'gallery', title: 'Gallery', category: 'Section', target: 'gallery', keywords: ['photos', 'memories'] },
  { id: 'resources', title: 'Resources', category: 'Section', target: 'resources', keywords: ['learn', 'roadmap', 'study'] },
  { id: 'community', title: 'Community', category: 'Section', target: 'community', keywords: ['collaborate', 'teams'] },
  { id: 'journey', title: 'Journey', category: 'Section', target: 'journey', keywords: ['timeline', 'history'] },
  { id: 'team', title: 'Team', category: 'Section', target: 'team', keywords: ['leads', 'domains', 'people'] },
  { id: 'contact', title: 'Contact', category: 'Section', target: 'contact', keywords: ['email', 'reach'] },
];

const ACTIONS: SiteIndexItem[] = [
  { id: 'dashboard', title: 'Member Dashboard', category: 'Action', target: 'dashboard', keywords: ['profile', 'account', 'passes'] },
  { id: 'nova', title: 'CSI Nova AI', category: 'Action', target: 'nova', keywords: ['assistant', 'ai', 'help', 'chat'] },
  { id: 'signup', title: 'Sign Up', category: 'Action', target: 'auth-signup', keywords: ['register', 'join', 'create account'] },
  { id: 'login', title: 'Log In', category: 'Action', target: 'auth-login', keywords: ['sign in'] },
];

function buildIndex(): SiteIndexItem[] {
  const events: SiteIndexItem[] = CHAPTER_EVENTS_CATALOG.map((e) => ({
    id: `event-${e.id}`,
    title: e.title,
    subtitle: e.label,
    category: 'Event' as const,
    target: 'events',
    keywords: [e.id, e.label, e.title, e.shortDescription].map((s) => s.toLowerCase()),
  }));

  const resources: SiteIndexItem[] = PUBLIC_RESOURCES.map((r) => ({
    id: `res-${r.id}`,
    title: r.title,
    subtitle: r.category,
    category: 'Resource' as const,
    target: 'resources',
    keywords: [r.title, r.category, r.description].map((s) => s.toLowerCase()),
  }));

  const projects: SiteIndexItem[] = SHOWCASE_PROJECTS.map((p) => ({
    id: `proj-${p.id}`,
    title: p.title,
    subtitle: p.domain,
    category: 'Project' as const,
    target: 'projects',
    keywords: [p.title, p.domain, p.stack.join(' ')].map((s) => s.toLowerCase()),
  }));

  const achievements: SiteIndexItem[] = ACHIEVEMENTS.map((a) => ({
    id: `ach-${a.id}`,
    title: a.title,
    subtitle: a.year,
    category: 'Achievement' as const,
    target: 'achievements',
    keywords: [a.title, a.category, a.description].map((s) => s.toLowerCase()),
  }));

  const journey: SiteIndexItem[] = PLATFORM_JOURNEY.map((j) => ({
    id: `faq-${j.id}`,
    title: j.question,
    subtitle: 'Platform FAQ',
    category: 'Section' as const,
    target: j.actionTarget.startsWith('auth') ? 'platform' : j.actionTarget,
    keywords: [j.question, j.answer].join(' ').toLowerCase().split(/\s+/),
  }));

  return [...SECTIONS, ...ACTIONS, ...events, ...resources, ...projects, ...achievements, ...journey];
}

let cached: SiteIndexItem[] | null = null;

export function getSiteIndex(): SiteIndexItem[] {
  if (!cached) cached = buildIndex();
  return cached;
}

export function searchSiteIndex(query: string, limit = 12): SiteIndexItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return getSiteIndex().filter((i) => i.category === 'Section' || i.category === 'Action').slice(0, 8);

  const scored = getSiteIndex().map((item) => {
    let score = 0;
    const title = item.title.toLowerCase();
    const subtitle = (item.subtitle ?? '').toLowerCase();
    if (title.includes(q)) score += 10;
    if (title.startsWith(q)) score += 5;
    if (subtitle.includes(q)) score += 4;
    for (const kw of item.keywords) {
      if (kw.includes(q)) score += 2;
      if (kw.startsWith(q)) score += 1;
    }
    return { item, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.item);
}
