import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import './index.css';
import App from './App.tsx';
import { setLenisInstance } from './lib/lenisScroll';
import { isTouchDevice, shouldUseSmoothScroll } from './lib/performance';
import { smoothScrollEasing } from './lib/motion';

function syncScrollProgress(scroll: number): void {
  const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  document.documentElement.style.setProperty('--immersive-scroll', (scroll / max).toFixed(4));
}

const Root = () => {
  useEffect(() => {
    if (!shouldUseSmoothScroll()) {
      document.documentElement.classList.add('native-smooth-scroll');
      const onScroll = () => syncScrollProgress(window.scrollY);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }

    const touch = isTouchDevice();
    const lenis = new Lenis({
      duration: touch ? 1.05 : 1.2,
      easing: smoothScrollEasing,
      lerp: touch ? 0.1 : 0.072,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.15,
      smoothWheel: true,
      syncTouch: true,
      autoResize: true,
    });

    setLenisInstance(lenis);
    document.documentElement.classList.add('lenis-scrolling');

    lenis.on('scroll', ({ scroll }) => syncScrollProgress(scroll));

    let rafId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      } else if (!rafId) {
        rafId = requestAnimationFrame(raf);
      }
    };

    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove('lenis-scrolling');
      setLenisInstance(undefined);
      lenis.destroy();
    };
  }, []);

  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<Root />);
