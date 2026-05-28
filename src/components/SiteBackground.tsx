import { useMemo } from 'react';
import { isLowPowerDevice, prefersReducedMotion } from '../lib/performance';
import './SiteBackground.css';

const SiteBackground = () => {
  const lite = isLowPowerDevice();
  const reduced = prefersReducedMotion();
  const particleCount = lite ? 18 : 42;

  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        left: `${(i * 17 + 7) % 96}%`,
        top: `${(i * 23 + 11) % 94}%`,
        size: 2 + (i % 4) * 0.75,
        delay: (i % 9) * 0.45,
        duration: 10 + (i % 6) * 1.8,
      })),
    [particleCount]
  );

  return (
    <div className={`site-background${lite ? ' site-background--lite' : ''}`} aria-hidden>
      <div className="site-background__base" />
      <div className="site-background__mesh" />
      <div className="site-background__grid" />
      <div className="site-background__grid site-background__grid--fine" />
      <div className="site-background__grid site-background__grid--animated" />

      {!reduced && (
        <>
          <div className="site-background__network" />
          <div className="site-background__energy site-background__energy--a" />
          <div className="site-background__energy site-background__energy--b" />
        </>
      )}

      <div className="site-background__glow site-background__glow--hero" />
      <div className="site-background__glow site-background__glow--mid-a" />
      <div className="site-background__glow site-background__glow--mid-b" />
      <div className="site-background__glow site-background__glow--lower" />

      <div className="site-background__streak site-background__streak--1" />
      <div className="site-background__streak site-background__streak--2" />
      <div className="site-background__streak site-background__streak--3" />

      <div className="site-background__vignette" />

      {particles.map((p) => (
        <span
          key={p.id}
          className="site-background__particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

export default SiteBackground;
