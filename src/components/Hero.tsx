import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import HeroAtmosphere from './HeroAtmosphere';
import HeroGlobe from './HeroGlobe';
import HeroAmbient from './ambient/HeroAmbient';
import { HERO_VALUE_PILLARS } from '../lib/platformContent';
import { scrollToSectionSmooth } from '../lib/lenisScroll';
import { getNavScrollOffset } from '../hooks/useLandingHashScroll';
import './Hero.css';

const CINEMATIC = [0.22, 1, 0.36, 1] as const;
const heroStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};
const heroItem = {
  hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease: CINEMATIC },
  },
};

const Hero = () => {
  const mouseRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    mouseRef.current = { x, y };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: 0, y: 0 };
  }, []);

  return (
    <section
      id="home"
      className="hero-section"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <HeroAtmosphere />
      <HeroAmbient />
      <div className="hero-globe-layer" aria-hidden>
        <HeroGlobe mouse={mouseRef} />
      </div>

      <motion.div
        className="hero-content"
        variants={heroStagger}
        initial="hidden"
        animate="show"
      >
        <motion.div className="hero-badge" variants={heroItem}>
          <span className="hero-badge__dot" />
          Code · Innovate · Impact
        </motion.div>

        <motion.h1 className="hero-title" variants={heroItem}>
          Building the Future Through
          <span className="hero-title__accent">Technology</span>
        </motion.h1>

        <motion.p className="hero-subtitle" variants={heroItem}>
          The Computer Society of India at VIT Chennai — your chapter operating system for events,
          learning, projects, and AI-guided participation across every tech domain.
        </motion.p>

        <motion.ul className="hero-pillars" variants={heroItem} aria-label="What CSI offers">
          {HERO_VALUE_PILLARS.map((pillar) => (
            <li key={pillar.id}>
              <button
                type="button"
                className="hero-pillar"
                onClick={() => scrollToSectionSmooth(pillar.target, getNavScrollOffset())}
              >
                <strong>{pillar.label}</strong>
                <span>{pillar.desc}</span>
              </button>
            </li>
          ))}
        </motion.ul>

        <motion.div className="hero-cta-row" variants={heroItem}>
          <a href="#events" className="hero-btn-primary">
            Explore Events
            <ChevronRight size={18} aria-hidden />
          </a>
          <a href="#dashboard-access" className="hero-btn-secondary">
            Join the member platform
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
