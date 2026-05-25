import { useMemo } from 'react';
import { isLowPowerDevice } from '../lib/performance';
import './SiteBackground.css';

const SiteBackground = () => {
  const particleCount = isLowPowerDevice() ? 12 : 22;

  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        left: `${(i * 17 + 7) % 96}%`,
        top: `${(i * 23 + 11) % 94}%`,
        size: 1.5 + (i % 3) * 0.5,
        delay: (i % 9) * 0.55,
        duration: 12 + (i % 6) * 2,
      })),
    [particleCount]
  );

  const lite = isLowPowerDevice();

  return (
    <div className={`site-background${lite ? ' site-background--lite' : ''}`} aria-hidden>
      <div className="site-background__base" />
      <div className="site-background__mesh" />
      <div className="site-background__grid" />
      <div className="site-background__grid site-background__grid--fine" />

      <div className="site-background__glow site-background__glow--hero" />
      <div className="site-background__glow site-background__glow--mid-a" />
      <div className="site-background__glow site-background__glow--mid-b" />
      <div className="site-background__glow site-background__glow--lower" />

      <div className="site-background__streak site-background__streak--1" />
      <div className="site-background__streak site-background__streak--2" />

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
