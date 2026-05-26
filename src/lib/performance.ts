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

/** Smaller globe mesh on phones — still WebGL, not the CSS fallback. */
export function isLiteGlobeDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return !window.matchMedia('(min-width: 768px)').matches;
}

/** CSS orb only when user prefers reduced motion. */
export function shouldUseStaticGlobe(): boolean {
  return prefersReducedMotion();
}
