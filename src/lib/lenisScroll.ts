import type Lenis from 'lenis';

declare global {
  interface Window {
    __csiLenis?: Lenis;
  }
}

export function setLenisInstance(instance: Lenis | undefined): void {
  window.__csiLenis = instance;
}

export function scrollToSectionSmooth(id: string, offset = -80): void {
  const el = document.getElementById(id);
  if (!el) return;

  const lenis = window.__csiLenis;
  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.35, easing: (t) => 1 - Math.pow(1 - t, 4) });
    return;
  }

  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: 'smooth' });
}
