import { motion } from 'framer-motion';
import { ChevronRight, LayoutDashboard, Sparkles, UserPlus } from 'lucide-react';
import { useAuth, dispatchOpenNova } from '../contexts/AuthContext';
import { DASHBOARD_QUICK_ACTIONS, MEMBER_BENEFITS } from '../lib/platformContent';
import { scrollToSectionSmooth } from '../lib/lenisScroll';
import { getNavScrollOffset } from '../hooks/useLandingHashScroll';
import './ContactCTA.css';

const CINEMATIC_EASE = [0.22, 1, 0.36, 1] as const;

export default function DashboardAccess() {
  const { user, openAuth, openDashboard } = useAuth();

  const handleQuick = (target: string) => {
    if (target === 'nova') {
      dispatchOpenNova();
      return;
    }
    scrollToSectionSmooth(target, getNavScrollOffset());
  };

  return (
    <section
      id="dashboard-access"
      className="contact-cta-section"
      aria-labelledby="dashboard-access-heading"
    >
      <div className="contact-cta-container">
        <motion.div
          className="contact-cta-panel"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: CINEMATIC_EASE }}
        >
          <span className="contact-cta-panel__glow" aria-hidden />
          <span className="contact-cta-panel__edge" aria-hidden />
          <span className="contact-cta-panel__shine" aria-hidden />

          <div className="contact-cta-content">
            <p className="contact-cta-eyebrow">Member platform</p>
            <h2 id="dashboard-access-heading" className="contact-cta-title">
              Your CSI <span className="contact-cta-title__accent">command center</span>
            </h2>
            <p className="contact-cta-subtitle">
              Register for events, save resources, track passes and certificates, and get
              personalized recommendations — all from one member dashboard.
            </p>

            <ul className="contact-cta-benefits">
              {MEMBER_BENEFITS.slice(0, 4).map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>

            <div className="contact-cta-quick">
              {DASHBOARD_QUICK_ACTIONS.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  className="contact-cta-quick__btn"
                  onClick={() => handleQuick(action.target)}
                >
                  <strong>{action.label}</strong>
                  <span>{action.desc}</span>
                </button>
              ))}
            </div>

            <div className="contact-cta-actions">
              <motion.button
                type="button"
                className="contact-cta-btn contact-cta-btn--primary"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => (user ? openDashboard() : openAuth('signup'))}
              >
                <span className="contact-cta-btn__glow" aria-hidden />
                {user ? <LayoutDashboard size={18} /> : <UserPlus size={18} />}
                {user ? 'Open member dashboard' : 'Create free member account'}
              </motion.button>
              <motion.button
                type="button"
                className="contact-cta-btn contact-cta-btn--secondary"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => dispatchOpenNova()}
              >
                <Sparkles size={18} />
                Ask CSI Nova
                <ChevronRight size={18} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
