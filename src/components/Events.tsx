import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  X,
  Calendar,
  MapPin,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Brain,
  Code2,
  Globe,
  Bot,
  Terminal,
  Layers,
  Star,
  Cpu,
} from 'lucide-react';
import { useMediaQuery } from '../lib/useMediaQuery';
import './Events.css';

export interface ChapterEvent {
  id: string;
  title: string;
  date: string;
  venue: string;
  label: string;
  image: string;
  imageAlt: string;
  shortDescription: string;
  fullDescription: string;
  speaker: { name: string; role: string };
  techIcons: LucideIcon[];
}

const eventsData: ChapterEvent[] = [
  {
    id: 'ai-nexus',
    title: 'AI Nexus Workshop',
    date: 'March 18, 2026',
    venue: 'AB-II, Lab 304 · VIT Chennai',
    label: 'AI/ML Workshop',
    image:
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Holographic AI neural interface dashboard',
    shortDescription:
      'Hands-on exploration of machine learning pipelines, intelligent agents, and real-world AI deployment.',
    fullDescription:
      'A guided workshop covering ML pipelines, practical AI tooling, and deploying intelligent features. Includes live labs, mentor feedback, and a closing demo session for all participants.',
    speaker: { name: 'Dr. Priya Nair', role: 'AI Research Mentor · CSI VITC' },
    techIcons: [Brain, Star, Cpu, Layers],
  },
  {
    id: 'codestorm',
    title: 'CodeStorm Hackathon',
    date: 'April 2–3, 2026',
    venue: 'Technology Tower · Main Hall',
    label: 'Hackathon',
    image:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Cyber-tech collaborative coding workspace',
    shortDescription:
      'A 24-hour innovation sprint building impactful products in neon-lit collaborative workspaces.',
    fullDescription:
      'Teams tackle real-world tracks overnight with mentor support, pitch coaching, and industry judging. Prizes and internship referrals for standout projects.',
    speaker: { name: 'Alex Johnson', role: 'Events Head · CSI VITC' },
    techIcons: [Code2, Globe, Terminal, Layers],
  },
  {
    id: 'webverse',
    title: 'WebVerse Bootcamp',
    date: 'February 22, 2026',
    venue: 'Online + CSI Tech Lab',
    label: 'Web Development',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Futuristic holographic coding dashboard',
    shortDescription:
      'Master modern frontends, motion design, and immersive web experiences with production-grade UI.',
    fullDescription:
      'Two days on component architecture, responsive UI, motion, and shipping polished apps. Ideal for members leveling up their frontend skills.',
    speaker: { name: 'Sarah Williams', role: 'Technical Lead · CSI VITC' },
    techIcons: [Globe, Code2, Layers],
  },
  {
    id: 'robofusion',
    title: 'RoboFusion Challenge',
    date: 'May 8, 2026',
    venue: 'Robotics Lab · Block 3',
    label: 'Robotics',
    image:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Humanoid robot in a technology lab',
    shortDescription:
      'Design autonomous systems with sensors, intelligent control, and competition-grade robotics labs.',
    fullDescription:
      'Build autonomous bots with sensor integration, motor control workshops, and competition heats in a fully equipped robotics lab.',
    speaker: { name: 'Michael Brown', role: 'Robotics Coordinator' },
    techIcons: [Bot, Cpu, Terminal],
  },
  {
    id: 'algox',
    title: 'AlgoX Arena',
    date: 'January 30, 2026',
    venue: 'Computer Centre · Lab 201',
    label: 'Competitive Programming',
    image:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Developer coding during a competitive programming session',
    shortDescription:
      'Level up algorithmic thinking through high-intensity contests in a cinematic coding arena.',
    fullDescription:
      'Rated contest rounds across DS&A topics with editorial walkthroughs. Perfect preparation for technical interviews and competitive programming platforms.',
    speaker: { name: 'Jane Smith', role: 'Chairperson · CSI VITC' },
    techIcons: [Terminal, Code2, Brain],
  },
];

/** Horizontal offset between cards — tuned to viewport width */
function getCardSpread() {
  if (typeof window === 'undefined') return 400;
  if (window.innerWidth < 520) return 0;
  if (window.innerWidth < 768) return 220;
  if (window.innerWidth < 1024) return 300;
  return 400;
}

const CINEMATIC_EASE = [0.22, 1, 0.36, 1] as const;

function getCardMotion(
  index: number,
  activeIndex: number,
  cardSpread: number,
  flatCarousel: boolean
) {
  const diff = index - activeIndex;
  const abs = Math.abs(diff);
  const isActive = diff === 0;

  if (flatCarousel) {
    return {
      x: 0,
      z: 0,
      scale: 1,
      rotateY: 0,
      rotateX: 0,
      opacity: isActive ? 1 : 0,
      filter: 'none',
      zIndex: isActive ? 30 : 0,
    };
  }

  if (abs > 2) {
    return {
      x: diff * cardSpread,
      z: -160,
      scale: 0.72,
      rotateY: diff * -16,
      rotateX: 4,
      opacity: 0,
      filter: 'brightness(0.35) saturate(0.75)',
      zIndex: 0,
    };
  }

  return {
    x: diff * cardSpread,
    z: isActive ? 88 : -abs * 76,
    scale: isActive ? 1 : abs === 1 ? 0.86 : 0.74,
    rotateY: diff * -14,
    rotateX: isActive ? 0 : abs * 3,
    opacity: isActive ? 1 : abs === 1 ? 0.5 : 0.3,
    filter: isActive
      ? 'brightness(1) saturate(1.02)'
      : abs === 1
        ? 'brightness(0.5) saturate(0.85)'
        : 'brightness(0.38) saturate(0.75)',
    zIndex: isActive ? 30 : 12 - abs,
  };
}

const EventModal = ({ event, onClose }: { event: ChapterEvent; onClose: () => void }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const initials = event.speaker.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <motion.div
      className="event-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      onClick={onClose}
    >
      <motion.div
        className="event-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-modal-title"
        initial={{ opacity: 0, scale: 0.94, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="event-modal-panel__holo" aria-hidden />
        <button type="button" className="event-modal-close" onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>

        <div className="event-modal-banner">
          <img src={event.image} alt={event.imageAlt} />
          <div className="event-modal-banner__overlay" />
        </div>

        <div className="event-modal-content">
          <span className="event-modal-label">{event.label}</span>
          <h2 id="event-modal-title" className="event-modal-title">
            {event.title}
          </h2>
          <div className="event-modal-meta">
            <span>
              <Calendar size={14} strokeWidth={1.5} /> {event.date}
            </span>
            <span>
              <MapPin size={14} strokeWidth={1.5} /> {event.venue}
            </span>
          </div>
          <p className="event-modal-desc">{event.fullDescription}</p>

          <p className="event-modal-section-title">Speaker / Mentor</p>
          <div className="event-modal-speaker">
            <div className="event-modal-speaker__avatar">{initials}</div>
            <div>
              <div className="event-modal-speaker__name">{event.speaker.name}</div>
              <div className="event-modal-speaker__role">{event.speaker.role}</div>
            </div>
          </div>

          <p className="event-modal-section-title">Technologies</p>
          <div className="event-modal-tech">
            {event.techIcons.map((Icon, i) => (
              <span key={i} className="event-modal-tech__icon">
                <Icon size={17} strokeWidth={1.5} />
              </span>
            ))}
          </div>

          <a href="#contact" className="event-modal-register" onClick={onClose}>
            Register Now
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Events = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<ChapterEvent | null>(null);
  const [cardSpread, setCardSpread] = useState(getCardSpread);
  const isMobileCarousel = useMediaQuery('(max-width: 767px)');
  const isTouch = useMediaQuery('(pointer: coarse)');
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const bannerMediaRef = useRef<HTMLDivElement>(null);
  const parallaxRaf = useRef(0);
  const total = eventsData.length;

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setCardSpread(getCardSpread()), 150);
    };
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % total);
  }, [total]);

  const closeModal = useCallback(() => setSelected(null), []);

  const applyStageParallax = useCallback((x: number, y: number) => {
    const track = trackRef.current;
    const banner = bannerMediaRef.current;
    if (track) {
      track.style.transform = `translate3d(${x * 5}px, ${y * 2.5}px, 0)`;
    }
    if (banner) {
      banner.style.transform = `translate3d(${x * 4}px, ${y * 2}px, 0)`;
    }
  }, []);

  const handleStageMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = stageRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      if (parallaxRaf.current) cancelAnimationFrame(parallaxRaf.current);
      parallaxRaf.current = requestAnimationFrame(() => {
        parallaxRaf.current = 0;
        applyStageParallax(x, y);
      });
    },
    [applyStageParallax]
  );

  const handleStageLeave = useCallback(() => {
    if (parallaxRaf.current) cancelAnimationFrame(parallaxRaf.current);
    applyStageParallax(0, 0);
  }, [applyStageParallax]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selected) return;
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goPrev, goNext, selected]);

  return (
    <section id="events" className="events-section text-csi-pale">
      <div className="events-container">
        <motion.header
          className="events-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="events-header__label">
            <span className="events-header__line" aria-hidden />
            <span>Events</span>
            <span className="events-header__line" aria-hidden />
          </div>
          <h2 className="events-title">
            Upcoming <span className="events-title__accent">Events</span>
          </h2>
          <p className="events-subtitle">
            Explore workshops, hackathons and competitions organized by CSI.
          </p>
        </motion.header>

        <div className="events-carousel">
          <motion.button
            type="button"
            className="events-carousel__arrow events-carousel__arrow--prev"
            onClick={goPrev}
            aria-label="Previous event"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
          >
            <span className="events-carousel__arrow-ring" aria-hidden />
            <ChevronLeft size={20} strokeWidth={2} />
          </motion.button>

          <div
            ref={stageRef}
            className="events-carousel__viewport"
            onMouseMove={isTouch ? undefined : handleStageMove}
            onMouseLeave={isTouch ? undefined : handleStageLeave}
          >
          <div className="events-carousel__stage">
            <div className="events-carousel__floor" aria-hidden />
            <div className="events-carousel__center-beam" aria-hidden />
            <div ref={trackRef} className="events-carousel__track">
              {eventsData.map((event, index) => {
                const cardMotion = getCardMotion(
                  index,
                  activeIndex,
                  cardSpread,
                  isMobileCarousel
                );
                const isActive = index === activeIndex;

                return (
                  <motion.article
                    key={event.id}
                    className={`events-carousel__card${isActive ? ' events-carousel__card--active' : ''}`}
                    animate={{
                      x: cardMotion.x,
                      z: cardMotion.z,
                      scale: cardMotion.scale,
                      rotateY: cardMotion.rotateY,
                      rotateX: cardMotion.rotateX,
                      opacity: cardMotion.opacity,
                      filter: cardMotion.filter,
                    }}
                    transition={{
                      duration: 0.72,
                      ease: CINEMATIC_EASE,
                    }}
                    style={{
                      zIndex: cardMotion.zIndex,
                      transformOrigin: 'center center',
                    }}
                    onClick={() => (isActive ? setSelected(event) : setActiveIndex(index))}
                    whileHover={
                      !isTouch && isActive
                        ? { y: -5, scale: 1.01, transition: { duration: 0.35, ease: CINEMATIC_EASE } }
                        : !isTouch
                          ? {
                              scale: cardMotion.scale * 1.02,
                              opacity: Math.min(cardMotion.opacity + 0.08, 0.62),
                              transition: { duration: 0.3 },
                            }
                          : undefined
                    }
                  >
                    <div className="events-carousel__card-shell" aria-hidden>
                      <span className="events-carousel__card-neon" />
                      <span className="events-carousel__card-edge" />
                      <span className="events-carousel__card-depth" />
                      <span className="events-carousel__card-glow" />
                      <span className="events-carousel__card-holo" />
                    </div>

                    {isActive && (
                      <div className="events-carousel__card-reflection" aria-hidden />
                    )}

                    <div className="events-carousel__card-face">
                      <div className="events-carousel__visual">
                        <div
                          ref={isActive ? bannerMediaRef : undefined}
                          className="events-carousel__banner-media"
                        >
                          <img src={event.image} alt={event.imageAlt} loading="lazy" decoding="async" />
                        </div>
                        <div className="events-carousel__banner-shine" aria-hidden />
                        <div className="events-carousel__banner-hologram" aria-hidden />
                        <div className="events-carousel__banner-overlay" />
                        <div className="events-carousel__banner-scan" aria-hidden />
                        {!isActive && (
                          <div className="events-carousel__visual-fade" aria-hidden />
                        )}
                      </div>

                      <div className="events-carousel__body">
                        {isActive ? (
                          <>
                            <div className="events-carousel__body-content">
                              <div className="events-carousel__meta-row">
                                <span className="events-carousel__label">{event.label}</span>
                                <span className="events-carousel__index">
                                  {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                                </span>
                              </div>
                              <h3 className="events-carousel__card-title">{event.title}</h3>
                              <p className="events-carousel__date">
                                <Calendar size={13} strokeWidth={1.5} />
                                {event.date}
                              </p>
                              <p className="events-carousel__venue">
                                <MapPin size={13} strokeWidth={1.5} />
                                {event.venue}
                              </p>
                              <p className="events-carousel__desc">{event.shortDescription}</p>
                            </div>
                            <div className="events-carousel__footer">
                              <div className="events-carousel__tech">
                                {event.techIcons.map((Icon, i) => (
                                  <span key={i} className="events-carousel__tech-icon">
                                    <Icon size={15} strokeWidth={1.5} />
                                  </span>
                                ))}
                              </div>
                              <span className="events-carousel__action">
                                View Details
                                <ArrowRight size={15} strokeWidth={2} />
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="events-carousel__body-compact">
                            <h3 className="events-carousel__card-title events-carousel__card-title--dim">
                              {event.title}
                            </h3>
                            <p className="events-carousel__date events-carousel__date--compact">
                              <Calendar size={11} strokeWidth={1.5} />
                              {event.date}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
          </div>

          <motion.button
            type="button"
            className="events-carousel__arrow events-carousel__arrow--next"
            onClick={goNext}
            aria-label="Next event"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
          >
            <span className="events-carousel__arrow-ring" aria-hidden />
            <ChevronRight size={20} strokeWidth={2} />
          </motion.button>
        </div>

        <div className="events-carousel__dots">
          {eventsData.map((event, i) => (
            <button
              key={event.id}
              type="button"
              className={`events-carousel__dot${i === activeIndex ? ' events-carousel__dot--active' : ''}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to ${event.title}`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && <EventModal event={selected} onClose={closeModal} />}
      </AnimatePresence>
    </section>
  );
};

export default Events;
