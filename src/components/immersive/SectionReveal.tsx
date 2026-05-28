import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { prefersReducedMotion } from '../../lib/performance';

const REVEAL = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
  },
};

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
      viewport={{ once: true, margin: '-80px 0px -60px 0px', amount: 0.12 }}
      variants={REVEAL}
    >
      {children}
    </motion.div>
  );
}
