import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { User } from '../src/models/User.js';
import { Event } from '../src/models/Event.js';
import { Resource } from '../src/models/Resource.js';
import { Announcement } from '../src/models/Announcement.js';
import { GalleryItem } from '../src/models/GalleryItem.js';
import { Project } from '../src/models/Project.js';

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/csi_platform';

const events = [
  {
    slug: 'ai-nexus',
    featured: true,
    title: 'AI Nexus Workshop',
    dateLabel: 'March 18, 2026',
    venue: 'AB-II, Lab 304 · VIT Chennai',
    label: 'AI/ML Workshop',
    image:
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Holographic AI neural interface dashboard',
    shortDescription:
      'Hands-on exploration of machine learning pipelines, intelligent agents, and real-world AI deployment.',
    fullDescription:
      'A guided workshop covering ML pipelines, practical AI tooling, and deploying intelligent features. Includes live labs, mentor feedback, and a closing demo session for all participants.',
    startISO: new Date('2026-03-18T09:30:00+05:30'),
    totalSeats: 80,
    seatsTaken: 12,
    speaker: { name: 'Dr. Priya Nair', role: 'AI Research Mentor · CSI VITC' },
    techIcons: ['brain', 'star', 'cpu', 'layers'],
  },
  {
    slug: 'codestorm',
    featured: true,
    title: 'CodeStorm Hackathon',
    dateLabel: 'April 2–3, 2026',
    venue: 'Technology Tower · Main Hall',
    label: 'Hackathon',
    image:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Cyber-tech collaborative coding workspace',
    shortDescription:
      'A 24-hour innovation sprint building impactful products in neon-lit collaborative workspaces.',
    fullDescription:
      'Teams tackle real-world tracks overnight with mentor support, pitch coaching, and industry judging. Prizes and internship referrals for standout projects.',
    startISO: new Date('2026-04-02T18:00:00+05:30'),
    totalSeats: 120,
    seatsTaken: 45,
    speaker: { name: 'Alex Johnson', role: 'Events Head · CSI VITC' },
    techIcons: ['code', 'globe', 'terminal', 'layers'],
  },
  {
    slug: 'webverse',
    title: 'WebVerse Bootcamp',
    dateLabel: 'February 22, 2026',
    venue: 'Online + CSI Tech Lab',
    label: 'Web Development',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Futuristic holographic coding dashboard',
    shortDescription:
      'Master modern frontends, motion design, and immersive web experiences with production-grade UI.',
    fullDescription:
      'Two days on component architecture, responsive UI, motion, and shipping polished apps. Ideal for members leveling up their frontend skills.',
    startISO: new Date('2026-02-22T10:00:00+05:30'),
    totalSeats: 60,
    seatsTaken: 28,
    speaker: { name: 'Sarah Williams', role: 'Technical Lead · CSI VITC' },
    techIcons: ['globe', 'code', 'layers'],
  },
  {
    slug: 'robofusion',
    title: 'RoboFusion Challenge',
    dateLabel: 'May 8, 2026',
    venue: 'Robotics Lab · Block 3',
    label: 'Robotics',
    image:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Humanoid robot in a technology lab',
    shortDescription:
      'Design autonomous systems with sensors, intelligent control, and competition-grade robotics labs.',
    fullDescription:
      'Build autonomous bots with sensor integration, motor control workshops, and competition heats in a fully equipped robotics lab.',
    startISO: new Date('2026-05-08T09:00:00+05:30'),
    totalSeats: 50,
    seatsTaken: 18,
    speaker: { name: 'Michael Brown', role: 'Robotics Coordinator' },
    techIcons: ['bot', 'cpu', 'terminal'],
  },
  {
    slug: 'algox',
    title: 'AlgoX Arena',
    dateLabel: 'January 30, 2026',
    venue: 'Computer Centre · Lab 201',
    label: 'Competitive Programming',
    image:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Developer coding during a competitive programming session',
    shortDescription:
      'Level up algorithmic thinking through high-intensity contests in a cinematic coding arena.',
    fullDescription:
      'Rated contest rounds across DS&A topics with editorial walkthroughs. Perfect preparation for technical interviews and competitive programming platforms.',
    startISO: new Date('2026-01-30T14:00:00+05:30'),
    totalSeats: 70,
    seatsTaken: 55,
    speaker: { name: 'Jane Smith', role: 'Chairperson · CSI VITC' },
    techIcons: ['terminal', 'code', 'brain'],
  },
];

const resources = [
  {
    title: 'CSI Nova AI Guide',
    description: 'Quick prompts and chapter FAQs for Nova.',
    url: '#',
    category: 'AI',
  },
  {
    title: 'Web Dev Starter Kit',
    description: 'React + Vite templates and UI patterns.',
    url: '#',
    category: 'Web',
  },
  {
    title: 'Python for Beginners',
    description: 'Foundations for workshops and CP tracks.',
    url: '#',
    category: 'Programming',
  },
  {
    title: 'Hackathon Prep Checklist',
    description: 'Team formation, pitch deck, and demo tips.',
    url: '#',
    category: 'Events',
  },
];

async function seed() {
  await mongoose.connect(mongoUri);
  console.log('Connected for seed');

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@csi.vitc.edu').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
  const adminName = process.env.ADMIN_NAME || 'CSI Admin';

  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: adminName,
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 10),
      role: 'admin',
      department: 'CSE',
      domainInterests: ['Web Development', 'AI / ML'],
      achievements: ['Explorer Badge', 'Chapter Lead'],
    });
    console.log('Admin created:', adminEmail);
  } else {
    console.log('Admin exists:', adminEmail);
  }

  for (const ev of events) {
    await Event.findOneAndUpdate({ slug: ev.slug }, { ...ev, isPublished: true }, { upsert: true, new: true });
  }
  console.log(`Seeded ${events.length} events`);

  for (const r of resources) {
    await Resource.findOneAndUpdate({ title: r.title }, { ...r, isPublished: true }, { upsert: true });
  }
  console.log(`Seeded ${resources.length} resources`);

  await Announcement.findOneAndUpdate(
    { title: 'Welcome to CSI Platform' },
    {
      title: 'Welcome to CSI Platform',
      body: 'Member accounts, event registration, and Nova assistant are live. Register for upcoming workshops from the Events section.',
      audience: 'all',
      isPublished: true,
      createdBy: admin._id,
    },
    { upsert: true }
  );

  const gallerySeed = [
    {
      title: 'AI Nexus Workshop',
      category: 'Workshops',
      imageUrl:
        'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=900&auto=format&fit=crop&q=80',
      caption: 'Hands-on ML labs',
      sortOrder: 1,
    },
    {
      title: 'CodeStorm Hackathon',
      category: 'Hackathons',
      imageUrl:
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80',
      caption: '24-hour innovation sprint',
      sortOrder: 2,
    },
    {
      title: 'CSI Core Team',
      category: 'Team',
      imageUrl:
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop&q=80',
      caption: 'Chapter leadership',
      sortOrder: 3,
    },
  ];

  for (const g of gallerySeed) {
    await GalleryItem.findOneAndUpdate(
      { title: g.title },
      { ...g, isPublished: true, createdBy: admin._id },
      { upsert: true }
    );
  }
  console.log(`Seeded ${gallerySeed.length} gallery items`);

  const projectSeed = [
    {
      slug: 'smart-campus',
      title: 'Smart Campus IoT',
      description: 'Sensor network for energy monitoring across VIT labs.',
      domain: 'Robotics / IoT',
      stack: ['Arduino', 'MQTT', 'React'],
      github: 'https://github.com',
      category: 'Team',
      featured: true,
    },
    {
      slug: 'nova-hub',
      title: 'CSI Nova Hub',
      description: 'Chapter AI assistant for events and resources.',
      domain: 'AI / Platform',
      stack: ['React', 'TypeScript', 'MongoDB'],
      github: 'https://github.com',
      category: 'Featured',
      featured: true,
    },
  ];

  for (const p of projectSeed) {
    await Project.findOneAndUpdate({ slug: p.slug }, { ...p, isPublished: true, createdBy: admin._id }, { upsert: true });
  }
  console.log(`Seeded ${projectSeed.length} projects`);

  console.log('Seed complete');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
