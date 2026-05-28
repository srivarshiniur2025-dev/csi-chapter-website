import { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { Brain, Globe, Bot, Terminal } from 'lucide-react';
import SectionAmbient from './ambient/SectionAmbient';
import './About.css';

const domains = [
  {
    title: 'AI/ML',
    description:
      'Exploring intelligent systems, machine learning models, and real-world AI applications.',
    icon: Brain,
  },
  {
    title: 'Web Development',
    description:
      'Designing and building modern, responsive, and interactive web experiences.',
    icon: Globe,
  },
  {
    title: 'Robotics',
    description:
      'Combining hardware and software to create innovative automated systems.',
    icon: Bot,
  },
  {
    title: 'Competitive Programming',
    description:
      'Strengthening problem-solving and algorithmic thinking through coding challenges.',
    icon: Terminal,
  },
];

const stats = [
  { value: 500, label: 'Members' },
  { value: 50, label: 'Projects' },
  { value: 20, label: 'Events' },
  { value: 10, label: 'Achievements' },
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
      <SectionAmbient preset="about" />
      <div className="about-container">
        <motion.header
          className="about-header"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="about-eyebrow">About CSI</span>
          <h2 className="about-title">Building the Future Through Technology</h2>
          <p className="about-description">
            CSI Student Chapter is a community of passionate innovators, developers, and creators
            focused on building technical skills through projects, hackathons, workshops, and
            collaborative learning. We aim to create an environment where students explore AI/ML,
            web development, robotics, and emerging technologies while growing together as a
            technical community.
          </p>
        </motion.header>

        <div className="about-domains">
          {domains.map(({ title, description, icon: Icon }, index) => (
            <motion.article
              key={title}
              className="about-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="about-card__icon">
                <Icon size={22} strokeWidth={2} />
              </div>
              <h3 className="about-card__title">{title}</h3>
              <p className="about-card__text">{description}</p>
            </motion.article>
          ))}
        </div>

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
      </div>
    </section>
  );
};

export default About;
