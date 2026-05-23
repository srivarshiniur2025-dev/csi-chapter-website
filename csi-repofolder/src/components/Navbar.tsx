import VitChennaiLogo from './VitChennaiLogo';
import './Navbar.css';

const navLinks = [
  { label: 'Home', to: 'home' },
  { label: 'About', to: 'about' },
  { label: 'Events', to: 'events' },
  { label: 'Team', to: 'team' },
  { label: 'Contact Us', to: 'contact' },
];

const CodeLogo = () => (
  <span className="csi-navbar-code-icon" aria-hidden>
    <span className="csi-navbar-code-bracket">&lt;</span>
    <span className="csi-navbar-code-slash">/</span>
    <span className="csi-navbar-code-bracket">&gt;</span>
  </span>
);

const Navbar = () => {
  return (
    <header className="csi-navbar">
      <div className="csi-navbar-inner">
        <div className="csi-navbar-left">
          <a href="#home" className="csi-navbar-brand-cluster">
            <span className="csi-navbar-brand">
              <CodeLogo />
              <span className="csi-navbar-brand-text">
                <span className="csi-navbar-brand-title">CSI</span>
                <span className="csi-navbar-brand-sub">Student Chapter</span>
              </span>
            </span>
            <span className="csi-navbar-brand-divider" aria-hidden />
            <VitChennaiLogo variant="seal" size="nav" showLabel framed />
          </a>

          <ul className="csi-navbar-links" role="menubar">
            {navLinks.map(({ label, to }) => (
              <li key={label} role="none">
                <a
                  href={`#${to}`}
                  className={`csi-navbar-link${label === 'Home' ? ' is-active' : ''}`}
                  role="menuitem"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="csi-navbar-actions">
          <a href="#team" className="csi-navbar-btn-primary">
            Join Us
            <span className="csi-navbar-btn-arrow" aria-hidden>
              ↗
            </span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
