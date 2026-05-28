import { useEffect } from 'react';
import { isLowPowerDevice, prefersReducedMotion } from '../lib/performance';

/** Drives --ambient-mx / --ambient-my (-1…1) for subtle CSS parallax on floating decor */
export function useAmbientParallax() {
  useEffect(() => {
    if (prefersReducedMotion() || isLowPowerDevice()) {
      document.documentElement.style.setProperty('--ambient-mx', '0');
      document.documentElement.style.setProperty('--ambient-my', '0');
      return;
    }

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mx = (e.clientX / window.innerWidth - 0.5) * 2;
        const my = (e.clientY / window.innerHeight - 0.5) * 2;
        document.documentElement.style.setProperty('--ambient-mx', mx.toFixed(4));
        document.documentElement.style.setProperty('--ambient-my', my.toFixed(4));
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);
}
