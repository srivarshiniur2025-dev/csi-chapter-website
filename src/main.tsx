import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import './index.css';
import App from './App.tsx';
import { setLenisInstance } from './lib/lenisScroll';
import { shouldUseSmoothScroll } from './lib/performance';

const Root = () => {
  useEffect(() => {
    if (!shouldUseSmoothScroll()) {
      document.documentElement.classList.add('native-smooth-scroll');
      return;
    }

    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
      smoothWheel: true,
      syncTouch: true,
      lerp: 0.085,
    });

    setLenisInstance(lenis);
    document.documentElement.classList.add('lenis-scrolling');

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
