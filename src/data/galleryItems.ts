export type GalleryCategory = 'All' | 'Events' | 'Workshops' | 'Hackathons' | 'Team' | 'Technical';

export interface GalleryItem {
  id: string;
  title: string;
  category: Exclude<GalleryCategory, 'All'>;
  imageUrl: string;
  caption: string;
}

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  'All',
  'Events',
  'Workshops',
  'Hackathons',
  'Team',
  'Technical',
];

export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: 'AI Nexus Workshop',
    category: 'Workshops',
    imageUrl:
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=900&auto=format&fit=crop&q=80',
    caption: 'Hands-on ML labs and mentor sessions',
  },
  {
    id: 'g2',
    title: 'CodeStorm Hackathon',
    category: 'Hackathons',
    imageUrl:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80',
    caption: '24-hour innovation sprint',
  },
  {
    id: 'g3',
    title: 'CSI Core Team',
    category: 'Team',
    imageUrl:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop&q=80',
    caption: 'Chapter leadership and mentors',
  },
  {
    id: 'g4',
    title: 'RoboFusion Challenge',
    category: 'Technical',
    imageUrl:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&auto=format&fit=crop&q=80',
    caption: 'Robotics and automation showcase',
  },
  {
    id: 'g5',
    title: 'WebVerse Bootcamp',
    category: 'Workshops',
    imageUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80',
    caption: 'Futuristic UI and React motion',
  },
  {
    id: 'g6',
    title: 'Innovation Showcase',
    category: 'Events',
    imageUrl:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&auto=format&fit=crop&q=80',
    caption: 'Student project demos',
  },
  {
    id: 'g7',
    title: 'CyberShield Session',
    category: 'Technical',
    imageUrl:
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=900&auto=format&fit=crop&q=80',
    caption: 'Security drills and threat modeling',
  },
  {
    id: 'g8',
    title: 'Community Night',
    category: 'Team',
    imageUrl:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&auto=format&fit=crop&q=80',
    caption: 'Networking and chapter culture',
  },
];
