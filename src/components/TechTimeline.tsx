import { useRef, type CSSProperties } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Brain,
  Code2,
  Bot,
  Globe,
  Trophy,
  Users,
  Monitor,
  Sparkles,
} from 'lucide-react';
import SectionAmbient from './ambient/SectionAmbient';
import './TechTimeline.css';

const CINEMATIC_EASE = [0.22, 1, 0.36, 1] as const;

type TimelineCategory =
  | 'Workshop'
  | 'Hackathon'
  | 'Robotics'
  | 'Web Development'
  | 'Projects'
  | 'Achievement'
  | 'Community'
  | 'Technical Session';

interface TimelineEntry {
  id: string;
  title: string;
  category: TimelineCategory;
  description: string;
  date: string;
  phase: string;
  tags: string[];
  image: string;
  imageAlt: string;
  icon: LucideIcon;
}

const timelineEntries: TimelineEntry[] = [
  {
    id: 'ai-nexus',
    title: 'AI Nexus Workshop',
    category: 'Workshop',
    description:
      'Exploring machine learning systems and intelligent applications through immersive technical sessions.',
    date: 'Mar 2026',
    phase: 'Workshops',
    tags: ['AI/ML', 'Neural Networks', 'Labs'],
    image:
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'AI holographic interface dashboard',
    icon: Brain,
  },
  {
    id: 'codestorm',
    title: 'CodeStorm Hackathon',
    category: 'Hackathon',
    description:
      'A collaborative innovation sprint focused on building impactful technology solutions.',
    date: 'Apr 2026',
    phase: 'Hackathons',
    tags: ['24h Sprint', 'Teams', 'Pitch'],
    image:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Collaborative hackathon coding space',
    icon: Code2,
  },
  {
    id: 'robofusion',
    title: 'RoboFusion Challenge',
    category: 'Robotics',
    description:
      'Integrating hardware logic and automation into futuristic robotic systems.',
    date: 'May 2026',
    phase: 'Projects',
    tags: ['Robotics', 'Sensors', 'Control'],
    image:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Robotics lab with humanoid systems',
    icon: Bot,
  },
  {
    id: 'webverse',
    title: 'WebVerse Bootcamp',
    category: 'Web Development',
    description:
      'Building modern interactive web experiences with futuristic UI systems.',
    date: 'Feb 2026',
    phase: 'Technical Sessions',
    tags: ['React', 'Motion UI', 'Design'],
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Futuristic web development dashboard',
    icon: Globe,
  },
  {
    id: 'innovation-showcase',
    title: 'CSI Innovation Showcase',
    category: 'Projects',
    description:
      'Presenting student-built technical projects and creative engineering solutions.',
    date: 'Jan 2026',
    phase: 'Projects',
    tags: ['Demo Day', 'Engineering', 'Showcase'],
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Students presenting technical projects',
    icon: Sparkles,
  },
  {
    id: 'cyber-shield',
    title: 'CyberShield Technical Session',
    category: 'Technical Session',
    description:
      'Hands-on cybersecurity drills, threat modeling, and secure-system design in a cyber-tech lab.',
    date: 'Nov 2025',
    phase: 'Technical Sessions',
    tags: ['Security', 'CTF', 'Networks'],
    image:
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Cybersecurity operations dashboard',
    icon: Monitor,
  },
  {
    id: 'tech-fest',
    title: 'CSI Tech Fest',
    category: 'Community',
    description:
      'A chapter-wide community event connecting builders, mentors, and industry guests across domains.',
    date: 'Oct 2025',
    phase: 'Community Events',
    tags: ['Networking', 'Talks', 'Community'],
    image:
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Community tech event gathering',
    icon: Users,
  },
  {
    id: 'national-award',
    title: 'National CSI Excellence Award',
    category: 'Achievement',
    description:
      'Recognized for outstanding student-led innovation, event impact, and technical community growth.',
    date: 'Sep 2025',
    phase: 'Achievements',
    tags: ['Award', 'National', 'Excellence'],
    image:
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Golden trophy award achievement celebration',
    icon: Trophy,
  },
];

const categoryFilters = [
  'All',
  'Workshops',
  'Hackathons',
  'Projects',
  'Achievements',
  'Community Events',
  'Technical Sessions',
] as const;

function TimelineCard({
  entry,
  index,
}: {
  entry: TimelineEntry;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: '-80px 0px -60px 0px', amount: 0.25 });
  const isRight = index % 2 === 1;
  const Icon = entry.icon;

  return (
    <motion.li
      className={`timeline-item${isRight ? ' timeline-item--right' : ''}`}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, ease: CINEMATIC_EASE }}
    >
      <motion.div
        className="timeline-node"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.45, delay: 0.05, ease: CINEMATIC_EASE }}
      >
        <span className="timeline-node__ring" aria-hidden />
        <span className="timeline-node__core">
          <Icon size={16} strokeWidth={1.5} />
        </span>
      </motion.div>

      <motion.article
        ref={cardRef}
        className="timeline-card"
        initial={{ opacity: 0, y: 36, x: isRight ? 24 : -24 }}
        animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
        transition={{ duration: 0.65, delay: 0.12, ease: CINEMATIC_EASE }}
        whileHover={{ y: -6, transition: { duration: 0.35, ease: CINEMATIC_EASE } }}
      >
        <div className="timeline-card__holo" aria-hidden />
        <div className="timeline-card__thumb">
          <img src={entry.image} alt={entry.imageAlt} loading="lazy" decoding="async" />
          <div className="timeline-card__thumb-overlay" />
          <span className="timeline-card__phase">{entry.phase}</span>
        </div>
        <div className="timeline-card__body">
          <div className="timeline-card__meta">
            <span className="timeline-card__category">{entry.category}</span>
            <time className="timeline-card__date">{entry.date}</time>
          </div>
          <h3 className="timeline-card__title">{entry.title}</h3>
          <p className="timeline-card__desc">{entry.description}</p>
          <div className="timeline-card__tags">
            {entry.tags.map((tag) => (
              <span key={tag} className="timeline-card__tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.article>
    </motion.li>
  );
}

const TechTimeline = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 0.85', 'end 0.35'],
  });

  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.15, 1], [0.2, 0.85, 1]);

  return (
    <section id="journey" className="timeline-section text-csi-pale" aria-labelledby="journey-heading">
      <SectionAmbient preset="journey" />
      <div className="timeline-section__particles" aria-hidden>
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} className="timeline-section__particle" style={{ '--p': i } as CSSProperties} />
        ))}
      </div>

      <div className="timeline-container">
        <motion.header
          className="timeline-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
        >
          <div className="timeline-header__label">
            <span className="timeline-header__line" aria-hidden />
            <span>Journey</span>
            <span className="timeline-header__line" aria-hidden />
          </div>
          <h2 id="journey-heading" className="timeline-title">
            Our <span className="timeline-title__accent">Journey</span>
          </h2>
          <p className="timeline-subtitle">
            Scroll through workshops, hackathons, projects, and milestones that shaped CSI VITC.
          </p>
          <ul className="timeline-filters" aria-label="Journey categories">
            {categoryFilters.map((label) => (
              <li key={label}>
                <span className={`timeline-filters__chip${label === 'All' ? ' timeline-filters__chip--active' : ''}`}>
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </motion.header>

        <div ref={trackRef} className="timeline-track">
          <div className="timeline-rail" aria-hidden>
            <div className="timeline-rail__base" />
            <motion.div
              className="timeline-rail__progress"
              style={{ scaleY: lineScale, opacity: glowOpacity }}
            />
            <motion.div
              className="timeline-rail__glow"
              style={{ scaleY: lineScale, opacity: glowOpacity }}
            />
          </div>

          <ol className="timeline-list">
            {timelineEntries.map((entry, index) => (
              <TimelineCard key={entry.id} entry={entry} index={index} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default TechTimeline;
