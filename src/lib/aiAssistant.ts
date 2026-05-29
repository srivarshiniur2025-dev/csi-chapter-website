import { api, isApiConfigured } from './api';
import { loadAdminNovaEntries, mergeKnowledge } from './novaKnowledge';

export interface QuickAction {
  id: string;
  label: string;
  query: string;
}

export const BOT_NAME = 'CSI Nova';

export const QUICK_ACTIONS: QuickAction[] = [
  { id: 'platform', label: 'How the platform works', query: 'How does the CSI member platform work?' },
  { id: 'events', label: 'Upcoming events', query: 'What upcoming events does CSI have?' },
  { id: 'register', label: 'Register for an event', query: 'How do I register for an event step by step?' },
  { id: 'benefits', label: 'Member benefits', query: 'What benefits do CSI members get?' },
  { id: 'resources', label: 'Learning resources', query: 'What learning resources does CSI provide?' },
  { id: 'domains', label: 'CSI domains', query: 'Tell me about CSI domains and which I should choose' },
  { id: 'gallery', label: 'Chapter gallery', query: 'Show me the CSI gallery' },
  { id: 'projects', label: 'Project showcase', query: 'What projects has CSI built?' },
  { id: 'achievements', label: 'Achievements', query: 'What has CSI achieved?' },
  { id: 'search', label: 'Find anything', query: 'How do I search the CSI platform?' },
  { id: 'contact', label: 'Contact CSI', query: 'How can I contact CSI?' },
];

export const MEMBER_QUICK_ACTIONS: QuickAction[] = [
  { id: 'dashboard', label: 'My dashboard', query: 'What can I do in my member dashboard?' },
  { id: 'my-events', label: 'My registrations', query: 'Where do I see my registered events?' },
  { id: 'pass', label: 'Event pass help', query: 'How do I get my event pass after registering?' },
];

export function getQuickActionsForUser(isLoggedIn: boolean): QuickAction[] {
  return isLoggedIn ? [...QUICK_ACTIONS.slice(0, 4), ...MEMBER_QUICK_ACTIONS, ...QUICK_ACTIONS.slice(4)] : QUICK_ACTIONS;
}

const FALLBACK =
  'Ask about events, domains, teams, registration, or learning paths — or tap a quick action below.';

export type ResponseMatch = {
  keywords: string[];
  response: string;
  scrollTo?: string;
};

const KNOWLEDGE: ResponseMatch[] = [
  {
    keywords: ['upcoming', 'events', 'event', 'hackathon', 'calendar', 'schedule'],
    response:
      'Upcoming: AI Nexus (Mar), CodeStorm (Apr), WebVerse (Feb), RoboFusion (May), AlgoX (Jan). Open Events and tap Register on any card.',
    scrollTo: 'events',
  },
  {
    keywords: ['platform', 'how it works', 'get started', 'guide', 'navigate'],
    response:
      'Start at About CSI, pick a domain track, browse Events, and create a member account in Join to open your dashboard.',
    scrollTo: 'dashboard-access',
  },
  {
    keywords: ['benefit', 'benefits', 'perks', 'why join', 'member get'],
    response:
      'Members get event registration, digital passes, bookmarks, reminders, achievements, personalized recommendations, and CSI Nova guidance. See the Join section for the full list.',
    scrollTo: 'dashboard-access',
  },
  {
    keywords: ['dashboard', 'my account', 'profile', 'certificate', 'pass'],
    response:
      'Open your dashboard from the navbar avatar: registered events, passes, resources, notifications, achievements, and activity.',
    scrollTo: 'dashboard-access',
  },
  {
    keywords: ['login', 'log in', 'sign in', 'account'],
    response:
      'Use Login or Sign Up in the navbar. After signing in, register for events and access your member dashboard.',
    scrollTo: 'dashboard-access',
  },
  {
    keywords: ['join', 'member', 'membership', 'sign up', 'signup', 'recruit'],
    response:
      'Create a free member account in the Join section. Members register for events, save resources, and use CSI Nova for guidance.',
    scrollTo: 'dashboard-access',
  },
  {
    keywords: ['domain', 'domains', 'team', 'teams', 'lead', 'chapter'],
    response:
      'Four domain tracks: AI/ML, Web Development, Robotics, and Competitive Programming. Explore each track in Domains, then meet leads in Team.',
    scrollTo: 'domains',
  },
  {
    keywords: ['workshop', 'bootcamp', 'session', 'lab', 'training'],
    response:
      'Coming up: AI Nexus, WebVerse Bootcamp, and CyberShield sessions. Check Events for dates and registration.',
    scrollTo: 'events',
  },
  {
    keywords: ['register', 'registration', 'sign up for', 'ticket', 'seat', 'spots'],
    response:
      '1) Sign up · 2) Events section · 3) Select an event · 4) Register and receive your digital pass with QR. Check live seat counts on each card.',
    scrollTo: 'events',
  },
  {
    keywords: ['contact', 'email', 'phone', 'reach', 'location', 'address', 'instagram'],
    response:
      'csi@vitstudentchapter.com · VIT Campus Innovation Hub · @csi.vitc. Full details in Contact.',
    scrollTo: 'contact',
  },
  {
    keywords: ['gallery', 'photos', 'pictures', 'images', 'archive'],
    response:
      'Browse the Chapter Gallery after Events — workshops, hackathons, team moments, and milestones. Filter by category and tap any image to preview.',
    scrollTo: 'gallery',
  },
  {
    keywords: ['resource', 'resources', 'learn', 'study', 'roadmap', 'material'],
    response:
      'Browse the Resources section for curated learning paths. Members can save favorites in their dashboard.',
    scrollTo: 'resources',
  },
  {
    keywords: ['project', 'showcase', 'portfolio', 'github', 'built'],
    response:
      'See the Project Showcase for flagship chapter builds — stacks, GitHub links, and featured demos from each domain.',
    scrollTo: 'projects',
  },
  {
    keywords: ['achievement', 'achievements', 'award', 'win', 'milestone', 'hackathon win'],
    response:
      'Achievements & milestones — SIH finals, ICPC, research showcases, and chapter records. Open the Achievements section.',
    scrollTo: 'achievements',
  },
  {
    keywords: ['search', 'find', 'ctrl+k', 'command k', 'navigate'],
    response:
      'Press Ctrl+K (or Cmd+K) or tap Search in the navbar to jump to events, resources, sections, and dashboard actions instantly.',
  },
  {
    keywords: ['community', 'collaborate', 'testimonial', 'spotlight'],
    response:
      'Community covers project collaboration, member spotlights, and how to connect with domain teams via Contact.',
    scrollTo: 'community',
  },
  {
    keywords: ['beginner', 'start', 'learn', 'roadmap', 'confused', 'new'],
    response:
      'Start with web fundamentals and Python, then branch into AI/ML, robotics, or CP. Join workshops for guided learning.',
    scrollTo: 'about',
  },
  {
    keywords: ['team', 'core', 'member', 'members', 'coordinator', 'leadership'],
    response:
      'Find domain leads and coordinators in Team — roles across tech, events, and community.',
    scrollTo: 'team',
  },
  {
    keywords: ['hello', 'hi', 'hey', 'help', 'start'],
    response:
      'Hey! I can help with events, domains, teams, registration, and resources. What would you like to explore?',
  },
  {
    keywords: ['about', 'csi', 'chapter', 'what is', 'who'],
    response:
      'CSI VIT Chennai — innovators building skills through hackathons, workshops, and projects across AI, web, robotics, and CP.',
    scrollTo: 'about',
  },
];

export async function getAssistantResponseAsync(
  input: string
): Promise<{ text: string; scrollTo?: string }> {
  const local = getAssistantResponse(input);
  if (isApiConfigured()) {
    try {
      const { reply, scrollTo } = await api.assistantChat(input);
      return { text: reply, scrollTo: scrollTo ?? local.scrollTo };
    } catch {
      /* fall through to local knowledge */
    }
  }
  return local;
}

export function getAssistantResponse(input: string): { text: string; scrollTo?: string } {
  const normalized = input.toLowerCase().trim();
  if (!normalized) return { text: FALLBACK };

  const knowledge = mergeKnowledge(KNOWLEDGE, loadAdminNovaEntries());

  let best: ResponseMatch | null = null;
  let bestScore = 0;

  for (const entry of knowledge) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (normalized.includes(kw)) score += kw.length > 4 ? 2 : 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  if (best && bestScore > 0) {
    return { text: best.response, scrollTo: best.scrollTo };
  }

  return { text: FALLBACK };
}

export { scrollToSectionSmooth as scrollToSection } from './lenisScroll';

export const WELCOME_GREETING = "Hi! I'm CSI Nova 👋";
export const WELCOME_SUBLINE = 'Your friendly AI guide for CSI VIT Chennai.';
export const WELCOME_MESSAGE = `${WELCOME_GREETING}\n${WELCOME_SUBLINE}`;
