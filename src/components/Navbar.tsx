import { useState, useCallback, useEffect, type CSSProperties, type MouseEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Menu, Search, Sparkles, X } from 'lucide-react';
import SiteSearch, { useSiteSearchHotkey } from './navigation/SiteSearch';
import VitChennaiLogo from './VitChennaiLogo';
import { dispatchOpenNova, useAuth } from '../contexts/AuthContext';
import { useActiveSection } from '../hooks/useActiveSection';
import { getNavScrollOffset } from '../hooks/useLandingHashScroll';
import { scrollToSectionSmooth } from '../lib/lenisScroll';
import './Navbar.css';

const navLinks = [
  { label: 'Home', to: 'home', route: false },
  { label: 'About', to: 'about', route: false },
  { label: 'Platform', to: 'platform', route: false },
  { label: 'Events', to: 'events', route: false },
  { label: 'Projects', to: 'projects', route: false },
  { label: 'Resources', to: 'resources', route: false },
  { label: 'Gallery', to: 'gallery', route: false },
  { label: 'Achievements', to: 'achievements', route: false },
  { label: 'Team', to: 'team', route: false },
  { label: 'Contact', to: 'contact', route: false },
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [indicatorX, setIndicatorX] = useState(50);
  const activeSection = useActiveSection();
  const location = useLocation();
  const onLanding = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!onLanding) return;
    const run = () => {
      const active = document.querySelector('.csi-navbar-links--desktop .csi-navbar-link.is-active');
      const inner = document.querySelector('.csi-navbar-inner');
      if (active && inner) {
        const a = active.getBoundingClientRect();
        const n = inner.getBoundingClientRect();
        setIndicatorX(((a.left + a.width / 2 - n.left) / n.width) * 100);
      }
    };
    run();
    window.addEventListener('resize', run);
    return () => window.removeEventListener('resize', run);
  }, [activeSection, onLanding, location.pathname]);

  const { user, profile, loading, openAuth, openDashboard, openAdmin } = useAuth();
  const isAdmin = user?.role === 'admin';

  useSiteSearchHotkey(() => setSearchOpen(true));

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const handleNavClick = useCallback(() => {
    closeMenu();
  }, [closeMenu]);

  const handleSectionNav = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
      closeMenu();
      if (location.pathname !== '/') return;
      e.preventDefault();
      scrollToSectionSmooth(sectionId, getNavScrollOffset());
    },
    [closeMenu, location.pathname]
  );

  const handleOpenDashboard = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      closeMenu();
      window.setTimeout(() => openDashboard(), 0);
    },
    [closeMenu, openDashboard]
  );

  const initials =
    (profile?.displayName || user?.displayName || user?.email || 'U')
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';

  const sectionHref = (id: string) => (location.pathname === '/' ? `#${id}` : `/#${id}`);

  const isSectionActive = (sectionId: string) => onLanding && activeSection === sectionId;

  return (
    <header
      className={`csi-navbar csi-os-chrome${scrolled ? ' csi-navbar--scrolled' : ''}`}
      style={{ '--nav-indicator-x': `${indicatorX}%` } as CSSProperties}
    >
      <span className="csi-navbar__edge-glow" aria-hidden />
      <span className="csi-navbar__os-pulse" aria-hidden />
      <div className="csi-navbar-inner">
        <div className="csi-navbar-left">
          <Link to="/" className="csi-navbar-brand-cluster" onClick={handleNavClick}>
            <span className="csi-navbar-brand">
              <CodeLogo />
              <span className="csi-navbar-brand-text">
                <span className="csi-navbar-brand-title">CSI</span>
                <span className="csi-navbar-brand-sub">Student Chapter</span>
              </span>
            </span>
            <span className="csi-navbar-brand-divider" aria-hidden />
            <VitChennaiLogo variant="seal" size="nav" showLabel framed />
          </Link>

          <ul className="csi-navbar-links csi-navbar-links--desktop" role="menubar">
            {navLinks.map(({ label, to, route }) => (
              <li key={label} role="none">
                {route ? (
                  <Link
                    to={to}
                    className={`csi-navbar-link${location.pathname === to ? ' is-active' : ''}`}
                    role="menuitem"
                    onClick={handleNavClick}
                  >
                    {label}
                  </Link>
                ) : (
                  <a
                    href={sectionHref(to)}
                    className={`csi-navbar-link${
                      (to === 'home' ? isSectionActive('home') : isSectionActive(to)) ? ' is-active' : ''
                    }`}
                    role="menuitem"
                    aria-current={
                      (to === 'home' ? isSectionActive('home') : isSectionActive(to)) ? 'page' : undefined
                    }
                    onClick={(e) => handleSectionNav(e, to)}
                  >
                    {label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="csi-navbar-actions">
          <button
            type="button"
            className="csi-navbar-btn-ghost csi-navbar-btn-ghost--desktop csi-navbar-search-btn"
            onClick={() => setSearchOpen(true)}
            aria-label="Search platform (Ctrl+K)"
          >
            <Search size={16} strokeWidth={1.5} aria-hidden />
            <span className="csi-navbar-search-label">Search</span>
          </button>
          <button
            type="button"
            className="csi-navbar-btn-ghost csi-navbar-btn-ghost--desktop"
            onClick={() => dispatchOpenNova()}
            aria-label="Open CSI Nova"
          >
            <Sparkles size={16} strokeWidth={1.5} aria-hidden />
            <span className="csi-navbar-nova-label">Nova</span>
          </button>
          {!loading && user ? (
            <>
              {isAdmin && (
                <button
                  type="button"
                  className="csi-navbar-btn-ghost csi-navbar-btn-ghost--desktop"
                  onClick={() => openAdmin()}
                >
                  Admin
                </button>
              )}
              <Link
                to="/dashboard"
                className="csi-navbar-btn-ghost csi-navbar-btn-ghost--desktop csi-navbar-dash-link"
                onClick={closeMenu}
              >
                <LayoutDashboard size={15} aria-hidden />
                Dashboard
              </Link>
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
            </>
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
          <div className="csi-navbar-drawer__quick">
            <button
              type="button"
              className="csi-navbar-drawer__quick-btn"
              onClick={() => {
                closeMenu();
                setSearchOpen(true);
              }}
            >
              <Search size={16} aria-hidden />
              Search
            </button>
            <button
              type="button"
              className="csi-navbar-drawer__quick-btn"
              onClick={() => {
                closeMenu();
                dispatchOpenNova();
              }}
            >
              <Sparkles size={16} aria-hidden />
              CSI Nova
            </button>
          </div>
          {navLinks.map(({ label, to, route }) =>
            route ? (
              <Link
                key={label}
                to={to}
                className={`csi-navbar-drawer__link${location.pathname === to ? ' is-active' : ''}`}
                onClick={handleNavClick}
              >
                {label}
              </Link>
            ) : (
              <a
                key={label}
                href={sectionHref(to)}
                className={`csi-navbar-drawer__link${
                  (to === 'home' ? isSectionActive('home') : isSectionActive(to)) ? ' is-active' : ''
                }`}
                onClick={(e) => handleSectionNav(e, to)}
              >
                {label}
              </a>
            )
          )}

          {!loading && user ? (
            <>
              {isAdmin && (
                <button
                  type="button"
                  className="csi-navbar-drawer__user"
                  onClick={() => {
                    closeMenu();
                    openAdmin();
                  }}
                >
                  Admin Console
                </button>
              )}
              <button
                type="button"
                className="csi-navbar-drawer__user"
                onClick={handleOpenDashboard}
              >
                <span className="csi-navbar-user__avatar">{initials}</span>
                Member Dashboard
              </button>
            </>
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

      <SiteSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
};

export default Navbar;
