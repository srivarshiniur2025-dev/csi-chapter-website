import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { prefersReducedMotion } from '../../lib/performance';
import { REVEAL_MOTION } from '../../lib/motion';

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
}

/** Cinematic scroll-in for non-hero sections */
export default function SectionReveal({ children, className }: SectionRevealProps) {
  if (prefersReducedMotion()) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px 0px -40px 0px', amount: 0.08 }}
      variants={REVEAL_MOTION}
    >
      {children}
    </motion.div>
  );
}
