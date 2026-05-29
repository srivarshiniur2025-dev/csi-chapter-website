import { motion } from 'framer-motion';
import { Brain, Bot, ChevronRight, Code2, Globe, Terminal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import SectionAmbient from '../ambient/SectionAmbient';
import SectionReveal from '../immersive/SectionReveal';
import {
  ACHIEVEMENTS,
  CSI_DOMAIN_TRACKS,
  SHOWCASE_PROJECTS,
} from '../../lib/platformContent';
import { scrollToSectionSmooth } from '../../lib/lenisScroll';
import { getNavScrollOffset } from '../../hooks/useLandingHashScroll';
import './Domains.css';

const EASE = [0.22, 1, 0.36, 1] as const;

const ICONS: Record<string, LucideIcon> = {
  brain: Brain,
  globe: Globe,
  bot: Bot,
  terminal: Terminal,
};

export default function Domains() {
  const featuredProjects = SHOWCASE_PROJECTS.filter((p) => p.featured).slice(0, 3);

  return (
    <section id="domains" className="csi-domains text-csi-pale" aria-labelledby="domains-heading">
      <SectionAmbient preset="about" />
      <SectionReveal className="csi-domains__inner">
        <header className="csi-domains__header">
          <p className="csi-domains__eyebrow">Technical domains</p>
          <h2 id="domains-heading" className="csi-domains__title">
            Choose your <span className="csi-domains__accent">domain track</span>
          </h2>
          <p className="csi-domains__desc">
            CSI VIT Chennai runs four active domains — each with dedicated leads, workshops,
            projects, and learning paths. Pick a track that matches your interests and join events
            in that space.
          </p>
        </header>

        <div className="csi-domains__grid">
          {CSI_DOMAIN_TRACKS.map((track, index) => {
            const Icon = ICONS[track.icon] ?? Code2;
            return (
              <motion.article
                key={track.id}
                className="csi-domains__card"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: index * 0.05, ease: EASE }}
              >
                <div className="csi-domains__card-icon">
                  <Icon size={22} strokeWidth={1.75} aria-hidden />
                </div>
                <h3>{track.title}</h3>
                <p className="csi-domains__lead">{track.lead}</p>
                <p className="csi-domains__text">{track.description}</p>
                <div className="csi-domains__tags">
                  {track.events.slice(0, 2).map((e) => (
                    <span key={e}>{e}</span>
                  ))}
                </div>
                <button
                  type="button"
                  className="csi-domains__link"
                  onClick={() => scrollToSectionSmooth('events', getNavScrollOffset())}
                >
                  View domain events
                  <ChevronRight size={14} aria-hidden />
                </button>
              </motion.article>
            );
          })}
        </div>

        <motion.section
          className="csi-domains__projects"
          aria-labelledby="domains-projects-heading"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <div className="csi-domains__subhead">
            <h3 id="domains-projects-heading">Chapter builds</h3>
            <p>Flagship projects built by CSI members across domains.</p>
          </div>
          <ul className="csi-domains__project-list">
            {featuredProjects.map((p) => (
              <li key={p.id}>
                <strong>{p.title}</strong>
                <span>{p.domain}</span>
                <p>{p.description}</p>
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section
          className="csi-domains__impact"
          aria-labelledby="domains-impact-heading"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <h3 id="domains-impact-heading">Chapter impact</h3>
          <ul>
            {ACHIEVEMENTS.slice(0, 3).map((a) => (
              <li key={a.id}>
                <span className="csi-domains__impact-year">{a.year}</span>
                <div>
                  <strong>{a.title}</strong>
                  <p>{a.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.section>
      </SectionReveal>
    </section>
  );
}
