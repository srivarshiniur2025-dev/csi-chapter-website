import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { isLowPowerDevice, prefersReducedMotion } from '../../lib/performance';
import './heroAmbient.css';

/** Subtle hero decor — rings, nodes, trails (keeps hero composition calm) */
export default function HeroAmbient() {
  if (prefersReducedMotion()) return null;

  const lite = isLowPowerDevice();

  return (
    <div className="hero-ambient" aria-hidden>
      {!lite && (
        <>
          <motion.div
            className="hero-ambient__ring hero-ambient__ring--outer"
            animate={{ rotate: 360 }}
            transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="hero-ambient__ring hero-ambient__ring--mid"
            animate={{ rotate: -360 }}
            transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="hero-ambient__ring hero-ambient__ring--inner"
            animate={{ rotate: 360 }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          />
        </>
      )}

      <div className="hero-ambient__nodes">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className="hero-ambient__node"
            style={{ ['--node-i' as string]: i } as CSSProperties}
          />
        ))}
      </div>

      <div className="hero-ambient__trails">
        <span className="hero-ambient__trail hero-ambient__trail--a" />
        <span className="hero-ambient__trail hero-ambient__trail--b" />
      </div>

      <div className="hero-ambient__scan" />
    </div>
  );
}
