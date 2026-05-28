import { motion } from 'framer-motion';
import { isLowPowerDevice, prefersReducedMotion } from '../../lib/performance';
import './teamImmersive.css';

/** Section-level holographic streaks and geometry behind team grid */
export default function TeamImmersive() {
  if (prefersReducedMotion()) return null;

  const lite = isLowPowerDevice();

  return (
    <div className="team-immersive" aria-hidden>
      <div className="team-immersive__glow team-immersive__glow--a" />
      <div className="team-immersive__glow team-immersive__glow--b" />

      <span className="team-immersive__streak team-immersive__streak--1" />
      <span className="team-immersive__streak team-immersive__streak--2" />

      {!lite && (
        <>
          <motion.div
            className="team-immersive__geo team-immersive__geo--ring"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="team-immersive__geo team-immersive__geo--hex"
            animate={{ rotate: -360 }}
            transition={{ duration: 52, repeat: Infinity, ease: 'linear' }}
          />
        </>
      )}

      <div className="team-immersive__particles">
        {Array.from({ length: lite ? 10 : 20 }).map((_, i) => (
          <span key={i} className="team-immersive__particle" style={{ ['--ti' as string]: i }} />
        ))}
      </div>
    </div>
  );
}
