import { motion } from 'framer-motion';
import { ExternalLink, Sparkles } from 'lucide-react';
import SectionAmbient from './ambient/SectionAmbient';
import SectionReveal from './immersive/SectionReveal';
import { dispatchOpenNova } from '../contexts/AuthContext';
import { PUBLIC_RESOURCES } from '../lib/platformContent';
import { scrollToSectionSmooth } from '../lib/lenisScroll';
import { getNavScrollOffset } from '../hooks/useLandingHashScroll';
import './Resources.css';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Resources() {
  const handleOpen = (resource: (typeof PUBLIC_RESOURCES)[number]) => {
    if (resource.id === 'nova') {
      dispatchOpenNova();
      return;
    }
    if (resource.href.startsWith('#')) {
      scrollToSectionSmooth(resource.href.slice(1), getNavScrollOffset());
      return;
    }
    window.open(resource.href, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="resources" className="csi-resources text-csi-pale" aria-labelledby="resources-heading">
      <SectionAmbient preset="about" />
      <SectionReveal className="csi-resources__inner">
        <header className="csi-resources__header">
          <p className="csi-resources__eyebrow">Learning &amp; tools</p>
          <h2 id="resources-heading" className="csi-resources__title">
            Chapter <span className="csi-resources__accent">Resources</span>
          </h2>
          <p className="csi-resources__desc">
            Curated paths for workshops and self-study. Sign in to save favorites in your member
            dashboard.
          </p>
        </header>

        <div className="csi-resources__grid">
          {PUBLIC_RESOURCES.map((r, index) => (
            <motion.article
              key={r.id}
              className="csi-resources__card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: index * 0.04, ease: EASE }}
            >
              <span className="csi-resources__cat">{r.category}</span>
              <h3 className="csi-resources__card-title">{r.title}</h3>
              <p className="csi-resources__card-desc">{r.description}</p>
              <button type="button" className="csi-resources__link" onClick={() => handleOpen(r)}>
                {r.id === 'nova' ? (
                  <>
                    <Sparkles size={14} /> Ask CSI Nova
                  </>
                ) : (
                  <>
                    Open resource <ExternalLink size={13} aria-hidden />
                  </>
                )}
              </button>
            </motion.article>
          ))}
        </div>
      </SectionReveal>
    </section>
  );
}
