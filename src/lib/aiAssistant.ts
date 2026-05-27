export interface QuickAction {
  id: string;
  label: string;
  query: string;
}

export const BOT_NAME = 'CSI Nova';

export const QUICK_ACTIONS: QuickAction[] = [
  { id: 'events', label: 'Explore Upcoming Events', query: 'What upcoming events does CSI have?' },
  { id: 'domains', label: 'Learn About CSI Domains', query: 'Tell me about CSI domains and teams' },
  { id: 'workshops', label: 'Find Workshops & Hackathons', query: 'What workshops and hackathons are coming up?' },
  { id: 'team', label: 'Team & Core Members', query: 'Who are the CSI team and core members?' },
  { id: 'projects', label: 'Project Showcase', query: 'Show me CSI projects and achievements' },
  { id: 'register', label: 'Registration Help', query: 'How do I register for an event?' },
  { id: 'contact', label: 'Contact CSI', query: 'How can I contact CSI?' },
  { id: 'resources', label: 'Technical Resources', query: 'What resources should beginners use to start learning?' },
];

const FALLBACK =
  'Ask about events, domains, teams, registration, or learning paths — or tap a quick action below.';

type ResponseMatch = {
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
    keywords: ['join', 'member', 'membership', 'sign up', 'signup', 'recruit'],
    response:
      'Attend orientation or reach out via Contact. We welcome AI/ML, web, robotics, and CP enthusiasts. Instagram: @csi.vitc.',
    scrollTo: 'contact',
  },
  {
    keywords: ['domain', 'domains', 'team', 'teams', 'lead', 'chapter'],
    response:
      'Four domains: AI/ML, Web Dev, Robotics, and CP. Meet leads and core members in the Team section.',
    scrollTo: 'team',
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
      'Go to Events → select a card → Register. Fill your details for a digital pass. Seats are limited.',
    scrollTo: 'events',
  },
  {
    keywords: ['contact', 'email', 'phone', 'reach', 'location', 'address', 'instagram'],
    response:
      'csi@vitstudentchapter.com · VIT Campus Innovation Hub · @csi.vitc. Full details in Contact.',
    scrollTo: 'contact',
  },
  {
    keywords: ['project', 'resources', 'showcase', 'journey', 'achievement', 'portfolio'],
    response:
      'Explore milestones in Journey — workshops, hackathons, and national wins. About covers 500+ members and 50+ projects.',
    scrollTo: 'journey',
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

export function getAssistantResponse(input: string): { text: string; scrollTo?: string } {
  const normalized = input.toLowerCase().trim();
  if (!normalized) return { text: FALLBACK };

  let best: ResponseMatch | null = null;
  let bestScore = 0;

  for (const entry of KNOWLEDGE) {
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
