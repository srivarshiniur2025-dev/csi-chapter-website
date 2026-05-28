import type { CSSProperties } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { isLowPowerDevice, prefersReducedMotion } from '../../lib/performance';
import './journeyImmersive.css';

interface JourneyImmersiveProps {
  scrollTarget: React.RefObject<HTMLElement | null>;
}

/** Timeline energy trails, fragments, and scroll-reactive atmosphere */
export default function JourneyImmersive({ scrollTarget }: JourneyImmersiveProps) {
  const localRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollTarget,
    offset: ['start end', 'end start'],
  });

  const energyOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.4]);
  const trailScale = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  if (prefersReducedMotion()) return null;

  const lite = isLowPowerDevice();

  return (
    <div ref={localRef} className="journey-immersive" aria-hidden>
      <motion.div className="journey-immersive__energy" style={{ opacity: energyOpacity }} />
      <motion.div
        className="journey-immersive__trail"
        style={{ scaleY: trailScale, opacity: energyOpacity }}
      />

      {!lite && (
        <motion.div
          className="journey-immersive__hex"
          animate={{ rotate: 360 }}
          transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
        />
      )}

      <div className="journey-immersive__fragments">
        <span className="journey-immersive__fragment journey-immersive__fragment--1" />
        <span className="journey-immersive__fragment journey-immersive__fragment--2" />
        <span className="journey-immersive__fragment journey-immersive__fragment--3" />
        <span className="journey-immersive__fragment journey-immersive__fragment--4" />
      </div>

      <div className="journey-immersive__particles">
        {Array.from({ length: lite ? 12 : 28 }).map((_, i) => (
          <span
            key={i}
            className="journey-immersive__particle"
            style={{ ['--ji' as string]: i } as CSSProperties}
          />
        ))}
      </div>

      <svg className="journey-immersive__paths" viewBox="0 0 200 800" preserveAspectRatio="none" aria-hidden>
        <path
          d="M100 0 L100 800"
          fill="none"
          stroke="url(#journeyGrad)"
          strokeWidth="2"
          strokeDasharray="8 12"
          className="journey-immersive__path-line"
        />
        <defs>
          <linearGradient id="journeyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(148,0,255,0)" />
            <stop offset="30%" stopColor="rgba(148,0,255,0.5)" />
            <stop offset="70%" stopColor="rgba(107,140,255,0.45)" />
            <stop offset="100%" stopColor="rgba(148,0,255,0)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
