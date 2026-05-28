import { useEffect } from 'react';
import { isLowPowerDevice, prefersReducedMotion } from '../lib/performance';

/** Smooth cursor parallax + scroll progress for immersive CSS / Framer layers */
export function useImmersiveMotion() {
  useEffect(() => {
    const root = document.documentElement;

    if (prefersReducedMotion() || isLowPowerDevice()) {
      root.style.setProperty('--ambient-mx', '0');
      root.style.setProperty('--ambient-my', '0');
      root.style.setProperty('--immersive-scroll', '0');
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

    const onScroll = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const p = window.scrollY / max;
      root.style.setProperty('--immersive-scroll', p.toFixed(4));
    };

    const tick = () => {
      smoothMx += (targetMx - smoothMx) * 0.08;
      smoothMy += (targetMy - smoothMy) * 0.08;
      root.style.setProperty('--ambient-mx', smoothMx.toFixed(4));
      root.style.setProperty('--ambient-my', smoothMy.toFixed(4));
      raf = requestAnimationFrame(tick);
    };

    onScroll();
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
}
