import { useState, useCallback, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Sparkles } from 'lucide-react';
import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';
import SectionAmbient from './ambient/SectionAmbient';
import './Contact.css';

const CINEMATIC_EASE = [0.22, 1, 0.36, 1] as const;

const contactItems = [
  {
    id: 'email',
    label: 'Email',
    value: 'csi@vitstudentchapter.com',
    href: 'mailto:csi@vitstudentchapter.com',
    Icon: Mail,
  },
  {
    id: 'phone',
    label: 'Phone',
    value: '+91 98765 43210',
    href: 'tel:+919876543210',
    Icon: Phone,
  },
  {
    id: 'location',
    label: 'Location',
    value: 'VIT Campus Innovation Hub',
    href: undefined,
    Icon: MapPin,
  },
] as const;

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/csi.vitc/', Icon: FaInstagram },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', Icon: FaLinkedin },
  { label: 'GitHub', href: 'https://github.com/', Icon: FaGithub },
];

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = useCallback(
    (field: keyof typeof form) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        setSubmitted(false);
      },
    []
  );

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
    },
    []
  );

  return (
    <section id="contact" className="contact-section text-csi-pale">
      <SectionAmbient preset="contact" />
      <div className="contact-container">
        <motion.header
          className="contact-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
        >
          <div className="contact-header__label">
            <span className="contact-header__line" aria-hidden />
            <span>Contact</span>
            <span className="contact-header__line" aria-hidden />
          </div>
          <h2 className="contact-title">
            Get In <span className="contact-title__accent">Touch</span>
          </h2>
          <p className="contact-subtitle">
            Connect with CSI to collaborate, innovate, and build the future together.
          </p>
        </motion.header>

        <div className="contact-layout">
          <motion.aside
            className="contact-info"
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: CINEMATIC_EASE }}
          >
            <div className="contact-info__panel">
              <span className="contact-info__panel-glow" aria-hidden />
              <span className="contact-info__panel-edge" aria-hidden />

              <div className="contact-status">
                <span className="contact-status__dot" aria-hidden />
                <span>We typically respond within 24 hours</span>
              </div>

              <ul className="contact-info__list">
                {contactItems.map((item, i) => {
                  const { Icon } = item;
                  const inner = (
                    <>
                      <span className="contact-info__icon-wrap">
                        <Icon size={18} strokeWidth={1.75} />
                      </span>
                      <span className="contact-info__text">
                        <span className="contact-info__item-label">{item.label}</span>
                        <span className="contact-info__item-value">{item.value}</span>
                      </span>
                    </>
                  );

                  return (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.08 * i, duration: 0.5, ease: CINEMATIC_EASE }}
                    >
                      {item.href ? (
                        <a href={item.href} className="contact-info__card">
                          {inner}
                        </a>
                      ) : (
                        <div className="contact-info__card">{inner}</div>
                      )}
                    </motion.li>
                  );
                })}
              </ul>

              <div className="contact-socials">
                <p className="contact-socials__label">Follow us</p>
                <div className="contact-socials__row">
                  {socialLinks.map(({ label, href, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      className="contact-socials__link"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                    >
                      <Icon size={18} aria-hidden />
                    </a>
                  ))}
                </div>
              </div>

              <div className="contact-orb" aria-hidden>
                <span className="contact-orb__ring contact-orb__ring--1" />
                <span className="contact-orb__ring contact-orb__ring--2" />
                <span className="contact-orb__core">
                  <Sparkles size={20} strokeWidth={1.5} />
                </span>
              </div>
            </div>
          </motion.aside>

          <motion.div
            className="contact-form-wrap"
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.1, ease: CINEMATIC_EASE }}
          >
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <span className="contact-form__glow" aria-hidden />
              <span className="contact-form__edge" aria-hidden />

              <div className="contact-form__grid">
                <label className="contact-field">
                  <span className="contact-field__label">Name</span>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange('name')}
                    placeholder="Your name"
                    required
                    autoComplete="name"
                    className="contact-field__input"
                  />
                </label>
                <label className="contact-field">
                  <span className="contact-field__label">Email</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    className="contact-field__input"
                  />
                </label>
              </div>

              <label className="contact-field">
                <span className="contact-field__label">Subject</span>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange('subject')}
                  placeholder="How can we help?"
                  required
                  className="contact-field__input"
                />
              </label>

              <label className="contact-field">
                <span className="contact-field__label">Message</span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange('message')}
                  placeholder="Tell us about your idea, collaboration, or question..."
                  required
                  rows={5}
                  className="contact-field__input contact-field__textarea"
                />
              </label>

              <motion.button
                type="submit"
                className="contact-submit"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="contact-submit__shine" aria-hidden />
                Send Message
                <Send size={18} strokeWidth={2} />
              </motion.button>

              {submitted && (
                <motion.p
                  className="contact-form__success"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="status"
                >
                  Thanks for reaching out — we&apos;ll get back to you soon.
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
