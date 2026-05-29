import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, ExternalLink } from 'lucide-react';
import SectionAmbient from '../ambient/SectionAmbient';
import SectionReveal from '../immersive/SectionReveal';
import { SHOWCASE_PROJECTS } from '../../lib/platformContent';
import './ProjectShowcase.css';

const EASE = [0.22, 1, 0.36, 1] as const;
const CATEGORIES = ['All', 'Featured', 'Team', 'Student', 'Workshop', 'Open Source'] as const;

export default function ProjectShowcase() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');

  const filtered = useMemo(() => {
    if (category === 'All') return [...SHOWCASE_PROJECTS];
    return SHOWCASE_PROJECTS.filter((p) => p.category === category);
  }, [category]);

  return (
    <section id="projects" className="csi-projects text-csi-pale" aria-labelledby="projects-heading">
      <SectionAmbient preset="events" />
      <SectionReveal className="csi-projects__inner">
        <header className="csi-projects__header">
          <p className="csi-projects__eyebrow">Built by members</p>
          <h2 id="projects-heading" className="csi-projects__title">
            Project <span className="csi-projects__accent">showcase</span>
          </h2>
          <p className="csi-projects__desc">
            Flagship chapter builds, open-source tools, and workshop demos — with stacks and links to
            explore.
          </p>
        </header>

        <div className="csi-projects__filters" role="tablist" aria-label="Project categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={category === cat}
              className={`csi-projects__filter${category === cat ? ' csi-projects__filter--active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="csi-projects__grid">
          {filtered.map((project, index) => (
            <motion.article
              key={project.id}
              className="csi-projects__card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: index * 0.05, ease: EASE }}
            >
              {project.featured ? <span className="csi-projects__badge">Featured</span> : null}
              <span className="csi-projects__domain">{project.domain}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="csi-projects__stack">
                {project.stack.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <div className="csi-projects__links">
                {project.github ? (
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <Code2 size={14} aria-hidden /> GitHub
                  </a>
                ) : null}
                {project.demo ? (
                  <a href={project.demo} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={14} aria-hidden /> Live demo
                  </a>
                ) : null}
              </div>
            </motion.article>
          ))}
        </div>
      </SectionReveal>
    </section>
  );
}
