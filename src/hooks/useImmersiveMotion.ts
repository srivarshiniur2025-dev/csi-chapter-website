import { useEffect } from 'react';
import { isLowPowerDevice, prefersReducedMotion } from '../lib/performance';

/** Smooth cursor parallax for ambient layers (desktop). Scroll progress is synced in main.tsx via Lenis. */
export function useImmersiveMotion() {
  useEffect(() => {
    const root = document.documentElement;

    if (prefersReducedMotion() || isLowPowerDevice()) {
      root.style.setProperty('--ambient-mx', '0');
      root.style.setProperty('--ambient-my', '0');
      return;
    }

    let raf = 0;
    let targetMx = 0;
    let targetMy = 0;
    let smoothMx = 0;
    let smoothMy = 0;

    const onMove = (e: MouseEvent) => {
      targetMx = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMy = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const tick = () => {
      smoothMx += (targetMx - smoothMx) * 0.065;
      smoothMy += (targetMy - smoothMy) * 0.065;
      root.style.setProperty('--ambient-mx', smoothMx.toFixed(4));
      root.style.setProperty('--ambient-my', smoothMy.toFixed(4));
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);
}
