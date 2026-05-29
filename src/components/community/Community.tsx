import { motion } from 'framer-motion';
import { ChevronRight, Users } from 'lucide-react';
import SectionAmbient from '../ambient/SectionAmbient';
import SectionReveal from '../immersive/SectionReveal';
import { COMMUNITY_HIGHLIGHTS, COMMUNITY_PROJECTS } from '../../lib/platformContent';
import { scrollToSectionSmooth } from '../../lib/lenisScroll';
import { getNavScrollOffset } from '../../hooks/useLandingHashScroll';
import './Community.css';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Community() {
  return (
    <section id="community" className="csi-community text-csi-pale" aria-labelledby="community-heading">
      <SectionAmbient preset="about" />
      <SectionReveal className="csi-community__inner">
        <header className="csi-community__header">
          <p className="csi-community__eyebrow">Chapter ecosystem</p>
          <h2 id="community-heading" className="csi-community__title">
            Community &amp; <span className="csi-community__accent">projects</span>
          </h2>
          <p className="csi-community__desc">
            Collaborate with domain teams, ship real projects, and showcase achievements across the CSI
            network.
          </p>
        </header>

        <ul className="csi-community__highlights">
          {COMMUNITY_HIGHLIGHTS.map((line) => (
            <li key={line}>
              <Users size={14} strokeWidth={1.5} aria-hidden />
              {line}
            </li>
          ))}
        </ul>

        <div className="csi-community__grid">
          {COMMUNITY_PROJECTS.map((project, index) => (
            <motion.article
              key={project.id}
              className="csi-community__card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: index * 0.06, ease: EASE }}
            >
              <span className="csi-community__domain">{project.domain}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <span className="csi-community__badge">{project.highlight}</span>
            </motion.article>
          ))}
        </div>

        <p className="csi-community__note">
          Discussion boards and team channels open after you join — connect via{' '}
          <button type="button" onClick={() => scrollToSectionSmooth('contact', getNavScrollOffset())}>
            Contact
            <ChevronRight size={12} aria-hidden />
          </button>{' '}
          or your member dashboard.
        </p>
      </SectionReveal>
    </section>
  );
}
