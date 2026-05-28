import { useEffect, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { prefersReducedMotion } from '../../lib/performance';
import './BootSequence.css';

const BOOT_KEY = 'csi-os-boot-v2';
const CINEMATIC = [0.22, 1, 0.36, 1] as const;

const BOOT_LINES = [
  'CSI Command Network',
  'Neural mesh online',
  'Nova AI core linked',
  'Member systems ready',
];

interface BootSequenceProps {
  children: ReactNode;
}

export default function BootSequence({ children }: BootSequenceProps) {
  const skip = prefersReducedMotion() || sessionStorage.getItem(BOOT_KEY) === '1';
  const [phase, setPhase] = useState<'boot' | 'done'>(skip ? 'done' : 'boot');
  const [line, setLine] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (phase !== 'boot') return;

    const timers: number[] = [];
    timers.push(window.setTimeout(() => setProgress(28), 400));
    timers.push(window.setTimeout(() => { setLine(1); setProgress(52); }, 900));
    timers.push(window.setTimeout(() => { setLine(2); setProgress(74); }, 1400));
    timers.push(window.setTimeout(() => { setLine(3); setProgress(92); }, 1900));
    timers.push(
      window.setTimeout(() => {
        setProgress(100);
        sessionStorage.setItem(BOOT_KEY, '1');
      }, 2400)
    );
    timers.push(window.setTimeout(() => setPhase('done'), 3000));

    return () => timers.forEach(clearTimeout);
  }, [phase]);

  return (
    <>
      <AnimatePresence>
        {phase === 'boot' && (
          <motion.div
            className="csi-boot"
            role="status"
            aria-live="polite"
            aria-label="Loading CSI platform"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: CINEMATIC }}
          >
            <div className="csi-boot__grid" aria-hidden />
            <div className="csi-boot__scan" aria-hidden />
            <div className="csi-boot__glow" aria-hidden />

            <motion.div
              className="csi-boot__panel"
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.55, ease: CINEMATIC }}
            >
              <div className="csi-boot__logo" aria-hidden>
                <span className="csi-boot__logo-bracket">&lt;</span>
                <span className="csi-boot__logo-core">CSI</span>
                <span className="csi-boot__logo-bracket">/&gt;</span>
              </div>
              <p className="csi-boot__title">VIT Chennai · Student Chapter</p>
              <p className="csi-boot__status">{BOOT_LINES[line]}</p>

              <div className="csi-boot__bar">
                <motion.span
                  className="csi-boot__bar-fill"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.35, ease: CINEMATIC }}
                />
              </div>
              <p className="csi-boot__pct">{progress}%</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="csi-app-root"
        initial={phase === 'boot' ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: CINEMATIC, delay: phase === 'boot' ? 0.15 : 0 }}
      >
        {children}
      </motion.div>
    </>
  );
}
