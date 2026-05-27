import type Lenis from 'lenis';

declare global {
  interface Window {
    __csiLenis?: Lenis;
  }
}

export function setLenisInstance(instance: Lenis | undefined): void {
  window.__csiLenis = instance;
}

export function scrollToSectionSmooth(id: string, offset = -72): void {
  const el = document.getElementById(id);
  if (!el) return;

  const lenis = window.__csiLenis;
  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.15 });
    return;
  }

  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
