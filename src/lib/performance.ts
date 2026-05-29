/** Lenis on all devices except reduced-motion; mobile uses lighter interpolation. */
export function shouldUseSmoothScroll(): boolean {
  if (typeof window === 'undefined') return false;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

export function isLiteGlobeDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return !window.matchMedia('(min-width: 768px)').matches;
}

export function shouldUseStaticGlobe(): boolean {
  return prefersReducedMotion();
}

export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches;
}
