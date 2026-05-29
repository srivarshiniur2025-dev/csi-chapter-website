import { useEffect } from 'react';
import { scrollToSectionSmooth } from '../lib/lenisScroll';

const NAV_OFFSET = -80;

/** Smooth-scroll to `#section` when landing with a hash (e.g. /#gallery). */
export function useLandingHashScroll() {
  useEffect(() => {
    const go = () => {
      const id = window.location.hash.replace(/^#/, '');
      if (!id) return;
      window.setTimeout(() => scrollToSectionSmooth(id, NAV_OFFSET), 120);
    };

    go();
    window.addEventListener('hashchange', go);
    return () => window.removeEventListener('hashchange', go);
  }, []);
}

export function getNavScrollOffset(): number {
  return NAV_OFFSET;
}
