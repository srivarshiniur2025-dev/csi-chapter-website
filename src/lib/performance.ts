/** Prefer native scroll on touch / reduced-motion devices (Lenis adds constant RAF work). */
export function shouldUseSmoothScroll(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    !window.matchMedia('(pointer: coarse)').matches &&
    window.matchMedia('(min-width: 768px)').matches
  );
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isLowPowerDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    prefersReducedMotion() ||
    window.matchMedia('(pointer: coarse)').matches ||
    !window.matchMedia('(min-width: 768px)').matches
  );
}
