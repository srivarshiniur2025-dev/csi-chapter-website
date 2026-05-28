import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { isLowPowerDevice, prefersReducedMotion } from '../../lib/performance';
import './eventsImmersive.css';

/** High-intensity holographic atmosphere behind the events carousel */
export default function EventsImmersive() {
  if (prefersReducedMotion()) return null;

  const lite = isLowPowerDevice();
  const particleCount = lite ? 14 : 32;

  return (
    <div className="events-immersive" aria-hidden>
      <div className="events-immersive__grid" />
      <div className="events-immersive__energy" />

      <motion.div
        className="events-immersive__ring events-immersive__ring--xl"
        animate={{ rotate: 360 }}
        transition={{ duration: 56, repeat: Infinity, ease: 'linear' }}
      />
      {!lite && (
        <motion.div
          className="events-immersive__ring events-immersive__ring--lg"
          animate={{ rotate: -360 }}
          transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
        />
      )}
      <motion.div
        className="events-immersive__ring events-immersive__ring--md"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      />

      <svg className="events-immersive__connections" viewBox="0 0 800 400" aria-hidden>
        <line x1="120" y1="200" x2="400" y2="120" stroke="rgba(148,0,255,0.25)" strokeWidth="1" />
        <line x1="400" y1="120" x2="680" y2="200" stroke="rgba(107,140,255,0.22)" strokeWidth="1" />
        <line x1="120" y1="200" x2="400" y2="280" stroke="rgba(148,0,255,0.2)" strokeWidth="1" />
        <line x1="400" y1="280" x2="680" y2="200" stroke="rgba(174,210,255,0.18)" strokeWidth="1" />
        <circle cx="400" cy="200" r="6" fill="rgba(232,242,255,0.9)" className="events-immersive__hub" />
        <circle cx="120" cy="200" r="4" fill="rgba(148,0,255,0.8)" />
        <circle cx="680" cy="200" r="4" fill="rgba(148,0,255,0.8)" />
      </svg>

      {!lite && (
        <>
          <motion.div
            className="events-immersive__symbol events-immersive__symbol--a"
            animate={{ rotate: 360 }}
            transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="events-immersive__symbol events-immersive__symbol--b"
            animate={{ rotate: -360 }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          />
        </>
      )}

      <div className="events-immersive__particles">
        {Array.from({ length: particleCount }).map((_, i) => (
          <span
            key={i}
            className="events-immersive__particle"
            style={{ ['--pi' as string]: i } as CSSProperties}
          />
        ))}
      </div>

      <div className="events-immersive__shards">
        <span className="events-immersive__shard events-immersive__shard--1" />
        <span className="events-immersive__shard events-immersive__shard--2" />
        <span className="events-immersive__shard events-immersive__shard--3" />
        <span className="events-immersive__shard events-immersive__shard--4" />
      </div>

      <div className="events-immersive__geo">
        <span className="events-immersive__cube" />
        <span className="events-immersive__prism" />
      </div>
    </div>
  );
}
