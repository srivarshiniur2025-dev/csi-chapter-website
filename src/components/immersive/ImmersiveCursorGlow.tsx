import { useEffect, useState } from 'react';
import { isLowPowerDevice, prefersReducedMotion } from '../../lib/performance';
import './immersive.css';

/** Soft cursor-reactive ambient light on desktop */
export default function ImmersiveCursorGlow() {
  const [pos, setPos] = useState({ x: 50, y: 40 });

  useEffect(() => {
    if (prefersReducedMotion() || isLowPowerDevice()) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setPos({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
        });
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  if (prefersReducedMotion() || isLowPowerDevice()) return null;

  return (
    <div
      className="immersive-cursor-glow"
      aria-hidden
      style={{
        background: `radial-gradient(
          circle 28vmin at ${pos.x}% ${pos.y}%,
          rgba(148, 0, 255, 0.14) 0%,
          rgba(107, 140, 255, 0.06) 35%,
          transparent 68%
        )`,
      }}
    />
  );
}
