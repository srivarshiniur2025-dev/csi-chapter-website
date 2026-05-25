import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';
import './Team.css';

const CINEMATIC_EASE = [0.22, 1, 0.36, 1] as const;

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
  imageAlt: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
}

const coreTeam: TeamMember[] = [
  {
    id: 'aarav',
    name: 'Aarav Sharma',
    role: 'Chapter Lead',
    description: 'Leading innovation, collaboration, and technical initiatives across CSI.',
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=480&auto=format&fit=crop&q=80',
    imageAlt: 'Professional team leader with purple-blue neon lighting',
    linkedin: 'https://www.linkedin.com/',
    github: 'https://github.com/',
    instagram: 'https://www.instagram.com/csi.vitc/',
  },
  {
    id: 'priya',
    name: 'Priya Nair',
    role: 'AI/ML Lead',
    description: 'Exploring intelligent systems and machine learning technologies.',
    image:
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=480&auto=format&fit=crop&q=80',
    imageAlt: 'AI researcher with holographic interfaces',
    linkedin: 'https://www.linkedin.com/',
    github: 'https://github.com/',
    instagram: 'https://www.instagram.com/csi.vitc/',
  },
  {
    id: 'rohan',
    name: 'Rohan Verma',
    role: 'Web Development Lead',
    description: 'Building modern interactive web experiences and UI systems.',
    image:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=480&auto=format&fit=crop&q=80',
    imageAlt: 'Frontend developer in futuristic coding workspace',
    linkedin: 'https://www.linkedin.com/',
    github: 'https://github.com/',
    instagram: 'https://www.instagram.com/csi.vitc/',
  },
  {
    id: 'meera',
    name: 'Meera Krishnan',
    role: 'Robotics Lead',
    description: 'Integrating hardware and software for futuristic automation projects.',
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=480&auto=format&fit=crop&q=80',
    imageAlt: 'Robotics lead in professional portrait',
    linkedin: 'https://www.linkedin.com/',
    github: 'https://github.com/',
    instagram: 'https://www.instagram.com/csi.vitc/',
  },
  {
    id: 'aditya',
    name: 'Aditya Rao',
    role: 'Competitive Programming Lead',
    description: 'Strengthening algorithmic thinking and problem-solving culture.',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=480&auto=format&fit=crop&q=80',
    imageAlt: 'Competitive programming lead in professional portrait',
    linkedin: 'https://www.linkedin.com/',
    github: 'https://github.com/',
    instagram: 'https://www.instagram.com/csi.vitc/',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: CINEMATIC_EASE },
  }),
};

const TeamMemberCard = ({ member, index }: { member: TeamMember; index: number }) => {
  const socials = [
    { href: member.linkedin, label: 'LinkedIn', Icon: FaLinkedin },
    { href: member.github, label: 'GitHub', Icon: FaGithub },
    { href: member.instagram, label: 'Instagram', Icon: FaInstagram },
  ].filter((s) => s.href);

  return (
    <motion.article
      className="team-card"
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -10, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
    >
      <span className="team-card__glow" aria-hidden />
      <span className="team-card__edge" aria-hidden />

      <div className="team-card__portrait">
        <span className="team-card__ring team-card__ring--outer" aria-hidden />
        <span className="team-card__ring team-card__ring--inner" aria-hidden />
        <div className="team-card__image-wrap">
          <img src={member.image} alt={member.imageAlt} loading="lazy" />
          <div className="team-card__image-overlay" aria-hidden />
          <div className="team-card__image-shine" aria-hidden />
        </div>
      </div>

      <div className="team-card__body">
        <h3 className="team-card__name">{member.name}</h3>
        <p className="team-card__role">{member.role}</p>
        <p className="team-card__desc">{member.description}</p>
        <div className="team-card__socials">
          {socials.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              className="team-card__social"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on ${label}`}
            >
              <Icon size={16} aria-hidden />
            </a>
          ))}
        </div>
      </div>
    </motion.article>
  );
};

const Team = () => {
  return (
    <section id="team" className="team-section text-csi-pale">
      <div className="team-container">
        <motion.header
          className="team-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="team-header__label">
            <span className="team-header__line" aria-hidden />
            <span>Core Team</span>
            <span className="team-header__line" aria-hidden />
          </div>
          <h2 className="team-title">
            Meet The <span className="team-title__accent">Team</span>
          </h2>
          <p className="team-subtitle">
            The minds behind CSI — driving innovation, collaboration, and technical leadership
            across every domain we explore.
          </p>
        </motion.header>

        <div className="team-grid">
          {coreTeam.map((member, index) => (
            <TeamMemberCard key={member.id} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
