import { motion } from 'framer-motion';
import { FaInstagram, FaLinkedinIn, FaGithub, FaXTwitter } from 'react-icons/fa6';
import VitChennaiLogo from './VitChennaiLogo';
import './Footer.css';

const CINEMATIC_EASE = [0.22, 1, 0.36, 1] as const;

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Events', href: '#events' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#contact' },
];

const connectLinks = [
  { label: 'Email', href: 'mailto:csi@vitstudentchapter.com' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { label: 'GitHub', href: 'https://github.com/' },
  { label: 'Instagram', href: 'https://www.instagram.com/csi.vitc/' },
];

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/csi.vitc/', Icon: FaInstagram },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', Icon: FaLinkedinIn },
  { label: 'GitHub', href: 'https://github.com/', Icon: FaGithub },
  { label: 'X', href: '#', Icon: FaXTwitter },
];

const CodeLogo = () => (
  <span className="site-footer__logo-icon" aria-hidden>
    <span className="site-footer__logo-bracket">&lt;</span>
    <span className="site-footer__logo-slash">/</span>
    <span className="site-footer__logo-bracket">&gt;</span>
  </span>
);

const Footer = () => {
  return (
    <footer id="footer" className="site-footer text-csi-pale">
      <div className="site-footer__container">
        <motion.div
          className="site-footer__main"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
        >
          <div className="site-footer__col site-footer__col--brand">
            <a href="#home" className="site-footer__brand">
              <span className="site-footer__brand-logos">
                <CodeLogo />
                <VitChennaiLogo variant="seal" size="inline" framed />
              </span>
              <div className="site-footer__brand-text">
                <span className="site-footer__brand-title">CSI</span>
                <span className="site-footer__brand-sub">VIT Chennai</span>
              </div>
            </a>
            <p className="site-footer__tagline">
              Computer Society of India — empowering students through code, innovation, and
              community.
            </p>
            <div className="site-footer__socials">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  className="site-footer__social"
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          <div className="site-footer__col">
            <h3 className="site-footer__heading">Navigate</h3>
            <ul className="site-footer__links">
              {navLinks.map(({ label, href }) => (
                <li key={label}>
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer__col">
            <h3 className="site-footer__heading">Connect</h3>
            <ul className="site-footer__links">
              {connectLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <div className="site-footer__divider" aria-hidden />

        <motion.div
          className="site-footer__bar"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: CINEMATIC_EASE }}
        >
          <div className="site-footer__bar-start">
            <VitChennaiLogo variant="seal" size="footer" framed />
            <p className="site-footer__copy">© 2026 CSI VIT Chennai. All rights reserved.</p>
          </div>
          <p className="site-footer__credit">Designed by CSI Technical Team</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
