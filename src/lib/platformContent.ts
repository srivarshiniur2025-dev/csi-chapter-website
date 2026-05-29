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

export const HERO_VALUE_PILLARS = [
  { id: 'events', label: 'Events', desc: 'Workshops & hackathons', target: 'events' },
  { id: 'domains', label: 'Domains', desc: 'AI · Web · Robotics · CP', target: 'domains' },
  { id: 'learn', label: 'Resources', desc: 'Domain roadmaps', target: 'resources' },
  { id: 'join', label: 'Join', desc: 'Member platform', target: 'dashboard-access' },
] as const;

export const CSI_DOMAIN_TRACKS = [
  {
    id: 'aiml',
    title: 'AI / Machine Learning',
    lead: 'Dr. Priya Nair · AI Research Mentor',
    description:
      'Hands-on ML pipelines, intelligent agents, and deployment workshops — from AI Nexus labs to national paper submissions.',
    events: ['AI Nexus Workshop', 'Nova ML Study Circle'],
    resources: ['AI / ML Starter Path', 'CSI Nova AI Guide'],
    icon: 'brain' as const,
  },
  {
    id: 'web',
    title: 'Web Development',
    lead: 'Sarah Williams · Technical Lead',
    description:
      'Modern React, motion design, and production UI — chapter sites, event platforms, and open-source design systems.',
    events: ['WebVerse Bootcamp', 'CodeStorm Hackathon'],
    resources: ['Web Development Roadmap', 'WebVerse Design System'],
    icon: 'globe' as const,
  },
  {
    id: 'robotics',
    title: 'Robotics & IoT',
    lead: 'Michael Brown · Robotics Coordinator',
    description:
      'Sensor integration, autonomous control, and competition-grade builds in VIT Chennai robotics labs.',
    events: ['RoboFusion Challenge', 'Smart Campus IoT Sprint'],
    resources: ['Smart Campus IoT Project', 'Hackathon Prep Checklist'],
    icon: 'bot' as const,
  },
  {
    id: 'cp',
    title: 'Competitive Programming',
    lead: 'Jane Smith · Chapter Chairperson',
    description:
      'Rated contests, editorial walkthroughs, and interview prep aligned with AlgoX Arena and industry hiring seasons.',
    events: ['AlgoX Arena', 'Weekly CP Practice'],
    resources: ['Competitive Programming', 'Interview Preparation'],
    icon: 'terminal' as const,
  },
] as const;

export const DASHBOARD_QUICK_ACTIONS = [
  { id: 'events', label: 'Browse events', desc: 'Register for workshops and hackathons', target: 'events' },
  { id: 'resources', label: 'Resource hub', desc: 'Roadmaps and chapter materials', target: 'resources' },
  { id: 'nova', label: 'Ask CSI Nova', desc: 'Instant answers and navigation', target: 'nova' },
  { id: 'team', label: 'Meet the team', desc: 'Domain leads and core members', target: 'team' },
] as const;

export const RESOURCE_CATEGORIES = [
  'All',
  'Getting Started',
  'Web',
  'AI/ML',
  'Cybersecurity',
  'Mobile',
  'Programming',
  'CP',
  'Interview',
  'Events',
  'Chapter',
] as const;

export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number];

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
  {
    id: 'cyber',
    title: 'Cybersecurity Fundamentals',
    category: 'Cybersecurity',
    description: 'OWASP basics, secure coding, and CyberShield workshop prep.',
    href: 'https://owasp.org/www-project-top-ten/',
  },
  {
    id: 'mobile',
    title: 'App Development Track',
    category: 'Mobile',
    description: 'Flutter and React Native paths for mobile chapter projects.',
    href: 'https://docs.flutter.dev/get-started/learn-more',
  },
  {
    id: 'interview',
    title: 'Interview Preparation',
    category: 'Interview',
    description: 'DSA patterns, system design primers, and resume tips from alumni.',
    href: 'https://www.techinterviewhandbook.org/',
  },
  {
    id: 'workshop',
    title: 'Workshop Materials Hub',
    category: 'Events',
    description: 'Slides and lab sheets from recent CSI sessions (members get updates).',
    href: '#resources',
  },
] as const;

export const SHOWCASE_PROJECTS = [
  {
    id: 'smart-campus',
    title: 'Smart Campus IoT',
    domain: 'Robotics / IoT',
    description: 'Sensor network for energy monitoring across VIT labs — chapter flagship build.',
    stack: ['Arduino', 'MQTT', 'React'],
    github: 'https://github.com',
    demo: '',
    category: 'Team',
    featured: true,
  },
  {
    id: 'nova-hub',
    title: 'CSI Nova Hub',
    domain: 'AI / Platform',
    description: 'Chapter AI assistant guiding members through events, resources, and domains.',
    stack: ['React', 'TypeScript', 'Firebase'],
    github: 'https://github.com',
    demo: '',
    category: 'Featured',
    featured: true,
  },
  {
    id: 'webverse',
    title: 'WebVerse Design System',
    domain: 'Web Development',
    description: 'Shared UI kit used across CSI event pages and member dashboards.',
    stack: ['React', 'Tailwind', 'Figma'],
    github: 'https://github.com',
    demo: '',
    category: 'Open Source',
    featured: false,
  },
  {
    id: 'algoviz',
    title: 'AlgoViz Trainer',
    domain: 'Competitive Programming',
    description: 'Interactive visualizer for sorting and graph algorithms used in AlgoX prep.',
    stack: ['TypeScript', 'Canvas'],
    github: 'https://github.com',
    demo: '',
    category: 'Student',
    featured: false,
  },
  {
    id: 'shield-scan',
    title: 'ShieldScan',
    domain: 'Cybersecurity',
    description: 'Lightweight vulnerability scanner demo built for CyberShield workshop.',
    stack: ['Python', 'FastAPI'],
    github: 'https://github.com',
    demo: '',
    category: 'Workshop',
    featured: false,
  },
] as const;

export const ACHIEVEMENTS = [
  {
    id: 'si-hack',
    title: 'Smart India Hackathon — Finalist',
    category: 'Hackathon',
    year: '2025',
    description: 'CSI team reached national finals with Smart Campus IoT solution.',
  },
  {
    id: 'icpc',
    title: 'ICPC Regionals — Top 20',
    category: 'Competition',
    year: '2024',
    description: 'Competitive programming squad placed in regional standings.',
  },
  {
    id: 'research',
    title: 'IEEE Student Research Showcase',
    category: 'Research',
    year: '2025',
    description: 'Two papers presented on ML for campus sustainability.',
  },
  {
    id: 'members',
    title: '500+ Active Members',
    category: 'Milestone',
    year: '2025',
    description: 'Chapter crossed 500 verified student members across domains.',
  },
  {
    id: 'codestorm',
    title: 'CodeStorm — 120 Teams',
    category: 'Event',
    year: '2025',
    description: 'Largest intra-chapter hackathon with industry mentors and live demos.',
  },
  {
    id: 'national',
    title: 'CSI National Student Convention',
    category: 'Recognition',
    year: '2024',
    description: 'Delegates represented VIT Chennai at the national CSI student meet.',
  },
] as const;

export const MEMBER_TESTIMONIALS = [
  {
    id: 't1',
    quote: 'CSI events gave me my first production React project and a team for SIH.',
    name: 'Aditi R.',
    role: 'Web Domain · 3rd Year',
  },
  {
    id: 't2',
    quote: 'Nova helped me pick workshops and prep for CodeStorm in one evening.',
    name: 'Rohan K.',
    role: 'AI/ML · 2nd Year',
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
    actionTarget: 'dashboard-access',
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
    actionTarget: 'dashboard-access',
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
