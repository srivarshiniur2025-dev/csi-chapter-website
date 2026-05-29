import { useEffect } from 'react';
import { scrollToSectionWhenReady } from '../lib/lenisScroll';

const NAV_OFFSET = -80;

/** Smooth-scroll to `#section` when landing with a hash (e.g. /#gallery). */
export function useLandingHashScroll() {
  useEffect(() => {
    const go = () => {
      const id = window.location.hash.replace(/^#/, '');
      if (!id) return;
      scrollToSectionWhenReady(id, NAV_OFFSET);
    };

    const t = window.setTimeout(go, 80);
    window.addEventListener('hashchange', go);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('hashchange', go);
    };
  }, []);
}

export function getNavScrollOffset(): number {
  return NAV_OFFSET;
}
