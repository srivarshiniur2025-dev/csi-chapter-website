import { motion } from 'framer-motion';
import { Award, Trophy } from 'lucide-react';
import SectionAmbient from '../ambient/SectionAmbient';
import SectionReveal from '../immersive/SectionReveal';
import { ACHIEVEMENTS } from '../../lib/platformContent';
import './Achievements.css';

const EASE = [0.22, 1, 0.36, 1] as const;

const CATEGORY_ICON: Record<string, typeof Trophy> = {
  Hackathon: Trophy,
  Competition: Award,
  Research: Award,
  Milestone: Trophy,
  Event: Award,
  Recognition: Trophy,
};

export default function Achievements() {
  return (
    <section id="achievements" className="csi-achievements text-csi-pale" aria-labelledby="achievements-heading">
      <SectionAmbient preset="about" />
      <SectionReveal className="csi-achievements__inner">
        <header className="csi-achievements__header">
          <p className="csi-achievements__eyebrow">Chapter impact</p>
          <h2 id="achievements-heading" className="csi-achievements__title">
            Achievements &amp; <span className="csi-achievements__accent">milestones</span>
          </h2>
          <p className="csi-achievements__desc">
            National recognition, research showcases, and member wins that define CSI VIT Chennai.
          </p>
        </header>

        <div className="csi-achievements__grid">
          {ACHIEVEMENTS.map((item, index) => {
            const Icon = CATEGORY_ICON[item.category] ?? Award;
            return (
              <motion.article
                key={item.id}
                className="csi-achievements__card"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: index * 0.05, ease: EASE }}
              >
                <span className="csi-achievements__icon" aria-hidden>
                  <Icon size={18} strokeWidth={1.5} />
                </span>
                <span className="csi-achievements__year">{item.year}</span>
                <span className="csi-achievements__cat">{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </motion.article>
            );
          })}
        </div>
      </SectionReveal>
    </section>
  );
}
