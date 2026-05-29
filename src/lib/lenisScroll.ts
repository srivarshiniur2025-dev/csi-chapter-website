import type Lenis from 'lenis';
import { SECTION_SCROLL_DURATION, smoothScrollEasing } from './motion';

declare global {
  interface Window {
    __csiLenis?: Lenis;
  }
}

export function setLenisInstance(instance: Lenis | undefined): void {
  window.__csiLenis = instance;
}

export function getLenisInstance(): Lenis | undefined {
  return window.__csiLenis;
}

export function scrollToSectionSmooth(id: string, offset = -80): void {
  const el = document.getElementById(id);
  if (!el) return;

  const lenis = window.__csiLenis;
  if (lenis) {
    lenis.scrollTo(el, {
      offset,
      duration: SECTION_SCROLL_DURATION,
      easing: smoothScrollEasing,
      lock: true,
    });
    return;
  }

  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

/** Wait for Lenis + target section (hash navigation on first paint). */
export function scrollToSectionWhenReady(id: string, offset = -80, attempts = 24): void {
  let left = attempts;
  const tryScroll = () => {
    const el = document.getElementById(id);
    if (el) {
      scrollToSectionSmooth(id, offset);
      return;
    }
    left -= 1;
    if (left > 0) window.requestAnimationFrame(tryScroll);
  };
  tryScroll();
}
