export interface JourneyCard {
  id: string;
  question: string;
  answer: string;
  actionLabel: string;
  actionTarget: string;
}

export const MEMBER_BENEFITS = [
  'Register for workshops, hackathons, and tech talks',
  'Digital event passes with QR check-in',
  'Personalized event recommendations',
  'CSI Nova AI guide for domains and resources',
  'Bookmarks, reminders, and achievement badges',
  'Member dashboard with registration history',
] as const;

export const PUBLIC_RESOURCES = [
  {
    id: 'nova',
    title: 'CSI Nova AI Guide',
    category: 'Getting Started',
    description: 'Ask Nova about events, domains, registration, and learning paths.',
    href: '#',
    action: 'nova' as const,
  },
  {
    id: 'web',
    title: 'Web Development Roadmap',
    category: 'Web',
    description: 'HTML, CSS, React, and modern frontend fundamentals for chapter workshops.',
    href: 'https://developer.mozilla.org/en-US/docs/Learn',
  },
  {
    id: 'python',
    title: 'Python for Beginners',
    category: 'Programming',
    description: 'Core syntax and problem-solving before AI/ML and CP tracks.',
    href: 'https://docs.python.org/3/tutorial/',
  },
  {
    id: 'ml',
    title: 'AI / ML Starter Path',
    category: 'AI/ML',
    description: 'Concepts and tools aligned with CSI AI Nexus and lab sessions.',
    href: 'https://www.kaggle.com/learn',
  },
  {
    id: 'hack',
    title: 'Hackathon Prep Checklist',
    category: 'Events',
    description: 'Team formation, Git workflow, and demo tips for CodeStorm-style events.',
    href: '#events',
  },
  {
    id: 'cp',
    title: 'Competitive Programming',
    category: 'CP',
    description: 'Practice platforms and patterns for AlgoX-style contests.',
    href: 'https://codeforces.com/',
  },
] as const;

export const PLATFORM_JOURNEY: JourneyCard[] = [
  {
    id: 'what',
    question: 'What is CSI?',
    answer:
      'The Computer Society of India (CSI) Student Chapter at VIT Chennai is a student-led tech community for workshops, hackathons, projects, and peer learning across AI/ML, web, robotics, and competitive programming.',
    actionLabel: 'Learn more',
    actionTarget: 'about',
  },
  {
    id: 'why',
    question: 'Why should I join?',
    answer:
      'Build real skills through hands-on events, meet domain leads, earn badges, and grow with 500+ members working on national-level projects and hackathons.',
    actionLabel: 'See benefits',
    actionTarget: 'platform',
  },
  {
    id: 'events',
    question: 'What events are happening?',
    answer:
      'Browse upcoming workshops, hackathons, and tech talks. Filter by time and category, check live seats, and register when you are signed in.',
    actionLabel: 'View events',
    actionTarget: 'events',
  },
  {
    id: 'resources',
    question: 'What resources are available?',
    answer:
      'Curated learning paths, workshop prep material, and CSI Nova for instant answers. Members save resources in their dashboard.',
    actionLabel: 'Browse resources',
    actionTarget: 'resources',
  },
  {
    id: 'register',
    question: 'How do I register for an event?',
    answer:
      'Sign up for a free member account, open any event, and complete registration. You receive a digital pass, calendar file, and reminders.',
    actionLabel: 'Go to events',
    actionTarget: 'events',
  },
  {
    id: 'login',
    question: 'How do I log in?',
    answer:
      'Use Login or Sign Up in the navbar. Connect with email or Google when Firebase is configured, or use the local demo account for testing.',
    actionLabel: 'Sign up',
    actionTarget: 'auth-signup',
  },
  {
    id: 'benefits',
    question: 'What do members get?',
    answer:
      'Dashboard access, event history, digital passes, bookmarks, notifications, achievements, and personalized recommendations from CSI Nova.',
    actionLabel: 'Open dashboard',
    actionTarget: 'dashboard',
  },
];

export const COMMUNITY_PROJECTS = [
  {
    id: 'smart-campus',
    title: 'Smart Campus IoT',
    domain: 'Robotics / IoT',
    description: 'Sensor network for energy monitoring across VIT labs — chapter flagship build.',
    highlight: 'National showcase 2025',
  },
  {
    id: 'nova-hub',
    title: 'CSI Nova Hub',
    domain: 'AI / Platform',
    description: 'Chapter AI assistant guiding members through events, resources, and domains.',
    highlight: 'Live on chapter site',
  },
  {
    id: 'webverse',
    title: 'WebVerse Design System',
    domain: 'Web Development',
    description: 'Shared UI kit used across CSI event pages and member dashboards.',
    highlight: 'Open source',
  },
] as const;

export const COMMUNITY_HIGHLIGHTS = [
  '500+ active members across CSE, IT, and ECE',
  '50+ technical projects shipped in the last academic year',
  'Hackathons, workshops, and national-level competition wins',
] as const;
