import { motion } from 'framer-motion';
import { ChevronRight, Users } from 'lucide-react';
import './ContactCTA.css';

const CINEMATIC_EASE = [0.22, 1, 0.36, 1] as const;

const ContactCTA = () => {
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
              Join a community of builders, innovators, and leaders — collaborate on events,
              projects, and the next wave of campus tech.
            </p>
            <div className="contact-cta-actions">
              <motion.a
                href="#contact"
                className="contact-cta-btn contact-cta-btn--primary"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="contact-cta-btn__glow" aria-hidden />
                Contact Us
                <ChevronRight size={18} strokeWidth={2} />
              </motion.a>
              <motion.a
                href="#team"
                className="contact-cta-btn contact-cta-btn--secondary"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Users size={18} strokeWidth={2} />
                Join Community
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactCTA;
