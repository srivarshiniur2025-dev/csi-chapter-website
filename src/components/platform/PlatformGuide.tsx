import { motion } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import SectionAmbient from '../ambient/SectionAmbient';
import SectionReveal from '../immersive/SectionReveal';
import { useAuth } from '../../contexts/AuthContext';
import { MEMBER_BENEFITS, PLATFORM_JOURNEY } from '../../lib/platformContent';
import { scrollToSectionSmooth } from '../../lib/lenisScroll';
import { getNavScrollOffset } from '../../hooks/useLandingHashScroll';
import './PlatformGuide.css';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function PlatformGuide() {
  const { user, openAuth, openDashboard } = useAuth();

  const handleAction = (target: string) => {
    if (target === 'auth-signup') {
      openAuth('signup');
      return;
    }
    if (target === 'dashboard') {
      if (user) openDashboard();
      else openAuth('signup');
      return;
    }
    scrollToSectionSmooth(target, getNavScrollOffset());
  };

  return (
    <section id="platform" className="platform-guide text-csi-pale" aria-labelledby="platform-heading">
      <SectionAmbient preset="about" />
      <SectionReveal className="platform-guide__inner">
        <header className="platform-guide__header">
          <p className="platform-guide__eyebrow">CSI Member Platform</p>
          <h2 id="platform-heading" className="platform-guide__title">
            Everything you need to <span className="platform-guide__accent">get started</span>
          </h2>
          <p className="platform-guide__desc">
            A clear path from discovering CSI to registering for events, accessing resources, and
            using your member dashboard.
          </p>
        </header>

        <div className="platform-guide__grid">
          {PLATFORM_JOURNEY.map((card, index) => (
            <motion.article
              key={card.id}
              className="platform-guide__card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: index * 0.04, ease: EASE }}
            >
              <h3 className="platform-guide__card-q">{card.question}</h3>
              <p className="platform-guide__card-a">{card.answer}</p>
              <button type="button" className="platform-guide__card-btn" onClick={() => handleAction(card.actionTarget)}>
                {card.actionLabel}
                <ChevronRight size={14} aria-hidden />
              </button>
            </motion.article>
          ))}
        </div>

        <motion.aside
          className="platform-guide__benefits"
          aria-labelledby="platform-benefits-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <div className="platform-guide__benefits-head">
            <Sparkles size={18} strokeWidth={1.5} aria-hidden />
            <h3 id="platform-benefits-title">Member benefits</h3>
          </div>
          <ul className="platform-guide__benefits-list">
            {MEMBER_BENEFITS.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <button
            type="button"
            className="platform-guide__benefits-cta"
            onClick={() => (user ? openDashboard() : openAuth('signup'))}
          >
            {user ? 'Open your dashboard' : 'Create free member account'}
            <ChevronRight size={16} aria-hidden />
          </button>
        </motion.aside>
      </SectionReveal>
    </section>
  );
}
