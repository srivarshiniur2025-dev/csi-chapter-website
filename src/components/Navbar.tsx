import { useState, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import VitChennaiLogo from './VitChennaiLogo';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const navLinks = [
  { label: 'Home', to: 'home' },
  { label: 'About', to: 'about' },
  { label: 'Events', to: 'events' },
  { label: 'Journey', to: 'journey' },
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
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, profile, loading, openAuth, openDashboard } = useAuth();

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const handleNavClick = useCallback(() => {
    closeMenu();
  }, [closeMenu]);

  const initials =
    (profile?.displayName || user?.displayName || user?.email || 'U')
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';

  return (
    <header className="csi-navbar">
      <div className="csi-navbar-inner">
        <div className="csi-navbar-left">
          <a href="#home" className="csi-navbar-brand-cluster" onClick={handleNavClick}>
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

          <ul className="csi-navbar-links csi-navbar-links--desktop" role="menubar">
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
          {!loading && user ? (
            <button
              type="button"
              className="csi-navbar-user csi-navbar-user--desktop"
              onClick={() => openDashboard()}
              aria-label="Open member dashboard"
            >
              <span className="csi-navbar-user__avatar">{initials}</span>
              <span className="csi-navbar-user__name">
                {profile?.displayName?.split(' ')[0] || 'Member'}
              </span>
            </button>
          ) : (
            <>
              <button
                type="button"
                className="csi-navbar-btn-ghost csi-navbar-btn-ghost--desktop"
                onClick={() => openAuth('login')}
              >
                Login
              </button>
              <button
                type="button"
                className="csi-navbar-btn-primary csi-navbar-btn-primary--desktop"
                onClick={() => openAuth('signup')}
              >
                Sign Up
              </button>
            </>
          )}

          <button
            type="button"
            className="csi-navbar-menu-btn"
            aria-expanded={menuOpen}
            aria-controls="csi-navbar-drawer"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
          </button>
        </div>
      </div>

      <div
        id="csi-navbar-drawer"
        className={`csi-navbar-drawer${menuOpen ? ' csi-navbar-drawer--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <nav className="csi-navbar-drawer__nav" aria-label="Mobile">
          {navLinks.map(({ label, to }) => (
            <a
              key={label}
              href={`#${to}`}
              className={`csi-navbar-drawer__link${label === 'Home' ? ' is-active' : ''}`}
              onClick={handleNavClick}
            >
              {label}
            </a>
          ))}

          {!loading && user ? (
            <button
              type="button"
              className="csi-navbar-drawer__user"
              onClick={() => {
                closeMenu();
                openDashboard();
              }}
            >
              <span className="csi-navbar-user__avatar">{initials}</span>
              Member Dashboard
            </button>
          ) : (
            <div className="csi-navbar-drawer__auth">
              <button
                type="button"
                className="csi-navbar-drawer__auth-login"
                onClick={() => {
                  closeMenu();
                  openAuth('login');
                }}
              >
                Login
              </button>
              <button
                type="button"
                className="csi-navbar-drawer__cta"
                onClick={() => {
                  closeMenu();
                  openAuth('signup');
                }}
              >
                Sign Up
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
