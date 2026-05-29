import { motion } from 'framer-motion';
import { ChevronRight, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { scrollToSectionSmooth } from '../lib/lenisScroll';
import { getNavScrollOffset } from '../hooks/useLandingHashScroll';
import './ContactCTA.css';

const CINEMATIC_EASE = [0.22, 1, 0.36, 1] as const;

const ContactCTA = () => {
  const { user, openAuth, openDashboard } = useAuth();

  return (
    <section className="contact-cta-section" aria-labelledby="contact-cta-heading">
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
            <h2 id="contact-cta-heading" className="contact-cta-title">
              Ready To Build The Future{' '}
              <span className="contact-cta-title__accent">With CSI?</span>
            </h2>
            <p className="contact-cta-subtitle">
              Create your member account to register for events, save resources, and use CSI Nova.
              Already a member? Open your dashboard anytime.
            </p>
            <div className="contact-cta-actions">
              <motion.button
                type="button"
                className="contact-cta-btn contact-cta-btn--primary"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => (user ? openDashboard() : openAuth('signup'))}
              >
                <span className="contact-cta-btn__glow" aria-hidden />
                <UserPlus size={18} strokeWidth={2} />
                {user ? 'Member dashboard' : 'Join CSI — Sign up'}
              </motion.button>
              <motion.button
                type="button"
                className="contact-cta-btn contact-cta-btn--secondary"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollToSectionSmooth('events', getNavScrollOffset())}
              >
                Browse events
                <ChevronRight size={18} strokeWidth={2} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactCTA;
