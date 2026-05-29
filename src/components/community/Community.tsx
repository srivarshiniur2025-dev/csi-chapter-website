import { motion } from 'framer-motion';
import { ChevronRight, MessageCircle, UserPlus, Users } from 'lucide-react';
import SectionAmbient from '../ambient/SectionAmbient';
import SectionReveal from '../immersive/SectionReveal';
import { COMMUNITY_HIGHLIGHTS, MEMBER_TESTIMONIALS } from '../../lib/platformContent';
import { scrollToSectionSmooth } from '../../lib/lenisScroll';
import { getNavScrollOffset } from '../../hooks/useLandingHashScroll';
import './Community.css';

const EASE = [0.22, 1, 0.36, 1] as const;

const ENGAGEMENT = [
  {
    icon: MessageCircle,
    title: 'Discussion hub',
    text: 'Domain channels for workshops, project help, and event Q&A (opens with membership).',
  },
  {
    icon: UserPlus,
    title: 'Team recruitment',
    text: 'Find hackathon teammates and project collaborators through chapter leads.',
  },
  {
    icon: Users,
    title: 'Member spotlights',
    text: 'Featured builders and competition winners highlighted each month.',
  },
] as const;

export default function Community() {
  return (
    <section id="community" className="csi-community text-csi-pale" aria-labelledby="community-heading">
      <SectionAmbient preset="about" />
      <SectionReveal className="csi-community__inner">
        <header className="csi-community__header">
          <p className="csi-community__eyebrow">Chapter ecosystem</p>
          <h2 id="community-heading" className="csi-community__title">
            Community &amp; <span className="csi-community__accent">collaboration</span>
          </h2>
          <p className="csi-community__desc">
            Connect with domain teams, recruit for projects, and grow with members who ship real
            software — not just attend events.
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

        <div className="csi-community__engage">
          {ENGAGEMENT.map((item, index) => (
            <motion.article
              key={item.title}
              className="csi-community__card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: index * 0.06, ease: EASE }}
            >
              <item.icon size={18} strokeWidth={1.5} aria-hidden />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </motion.article>
          ))}
        </div>

        <div className="csi-community__testimonials">
          {MEMBER_TESTIMONIALS.map((t) => (
            <blockquote key={t.id} className="csi-community__quote">
              <p>&ldquo;{t.quote}&rdquo;</p>
              <footer>
                <strong>{t.name}</strong>
                <span>{t.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>

        <p className="csi-community__note">
          Explore shipped work in{' '}
          <button type="button" onClick={() => scrollToSectionSmooth('projects', getNavScrollOffset())}>
            Projects
            <ChevronRight size={12} aria-hidden />
          </button>{' '}
          or reach domain leads via{' '}
          <button type="button" onClick={() => scrollToSectionSmooth('contact', getNavScrollOffset())}>
            Contact
            <ChevronRight size={12} aria-hidden />
          </button>
          .
        </p>
      </SectionReveal>
    </section>
  );
}
