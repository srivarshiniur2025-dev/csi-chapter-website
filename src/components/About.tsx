import { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import SectionAmbient from './ambient/SectionAmbient';
import SectionReveal from './immersive/SectionReveal';
import './About.css';

const stats = [
  { value: 500, label: 'Active members' },
  { value: 50, label: 'Projects shipped' },
  { value: 20, label: 'Events per year' },
  { value: 10, label: 'National recognitions' },
];

function AnimatedCounter({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, target, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setCount(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count}
      <span className="about-stat__suffix">+</span>
    </span>
  );
}

const About = () => {
  return (
    <section id="about" className="about-section text-csi-pale">
      <div className="about-section__holo" aria-hidden />
      <SectionAmbient preset="about" />
      <SectionReveal className="about-container">
        <motion.header
          className="about-header"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="about-eyebrow">About CSI VIT Chennai</span>
          <h2 className="about-title">The chapter hub for builders at VIT Chennai</h2>
          <p className="about-description">
            The Computer Society of India (CSI) Student Chapter at VIT Chennai is a student-led
            technical community where 500+ members explore AI/ML, web development, robotics, and
            competitive programming through workshops, hackathons, and real projects. We exist to
            help every student move from curiosity to contribution — with mentors, events, and a
            platform that keeps participation organized.
          </p>
        </motion.header>

        <motion.div
          className="about-stats"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {stats.map(({ value, label }) => (
            <div key={label} className="about-stat">
              <div className="about-stat__value">
                <AnimatedCounter target={value} />
              </div>
              <div className="about-stat__label">{label}</div>
            </div>
          ))}
        </motion.div>
      </SectionReveal>
    </section>
  );
};

export default About;
