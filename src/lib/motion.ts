/** Shared motion tokens — cinematic ease used across the CSI platform */
export const CINEMATIC_EASE = [0.22, 1, 0.36, 1] as const;

export const SMOOTH_EASE_CSS = 'cubic-bezier(0.22, 1, 0.36, 1)';

/** Lenis / programmatic scroll easing */
export function smoothScrollEasing(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export const SECTION_SCROLL_DURATION = 1.15;

export const REVEAL_MOTION = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: CINEMATIC_EASE },
  },
} as const;
