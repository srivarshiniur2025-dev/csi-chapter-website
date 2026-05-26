import { useRef, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';
import HeroAtmosphere from './HeroAtmosphere';
import HeroGlobe from './HeroGlobe';
import './Hero.css';

const Hero = () => {
  const mouseRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    mouseRef.current = { x, y };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: 0, y: 0 };
  }, []);

  return (
    <section
      id="home"
      className="hero-section"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <HeroAtmosphere />
      <div className="hero-globe-layer" aria-hidden>
        <HeroGlobe mouse={mouseRef} />
      </div>

      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge__dot" />
          Code · Innovate · Impact
        </div>

        <h1 className="hero-title">
          Building the Future Through
          <span className="hero-title__accent">Technology</span>
        </h1>

        <p className="hero-subtitle">
          CSI Student Chapter is a community of passionate innovators, developers, and tech
          enthusiasts driving change through AI/ML, web development, robotics, and cybersecurity.
        </p>

        <div className="hero-cta-row">
          <a href="#events" className="hero-btn-primary">
            Explore Events
            <ChevronRight size={18} aria-hidden />
          </a>
          <a href="#about" className="hero-btn-secondary">
            Our Projects
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
