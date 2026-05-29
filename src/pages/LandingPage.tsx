import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useImmersiveMotion } from '../hooks/useImmersiveMotion';
import { useLandingHashScroll } from '../hooks/useLandingHashScroll';
import { useAuth } from '../contexts/AuthContext';
import ImmersiveCursorGlow from '../components/immersive/ImmersiveCursorGlow';
import AmbientNetwork3D from '../components/ecosystem/AmbientNetwork3D';
import Navbar from '../components/Navbar';
import SiteBackground from '../components/SiteBackground';
import Hero from '../components/Hero';
import About from '../components/About';
import Domains from '../components/domains/Domains';
import Events from '../components/Events';
import TechTimeline from '../components/TechTimeline';
import Gallery from '../components/Gallery';
import Team from '../components/Team';
import Resources from '../components/Resources';
import DashboardAccess from '../components/DashboardAccess';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import SectionDivider from '../components/premium/SectionDivider';

/** Main marketing site — structured chapter platform flow */
export default function LandingPage() {
  useImmersiveMotion();
  useLandingHashScroll();
  const location = useLocation();
  const navigate = useNavigate();
  const { openAuth } = useAuth();

  useEffect(() => {
    const state = location.state as { auth?: string } | null;
    if (state?.auth === 'login') {
      openAuth('login');
      navigate(location.pathname + location.hash, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, location.hash, navigate, openAuth]);

  return (
    <div className="site-shell selection:bg-csi-accent selection:text-csi-pale">
      <ImmersiveCursorGlow />
      <SiteBackground />
      <AmbientNetwork3D />
      <div className="site-chrome" role="presentation">
        <Navbar />
      </div>
      <main id="main-content" className="site-main" tabIndex={-1}>
        <Hero />
        <SectionDivider variant="subtle" />
        <About />
        <SectionDivider />
        <Domains />
        <SectionDivider />
        <Events />
        <SectionDivider />
        <TechTimeline />
        <SectionDivider />
        <Gallery />
        <SectionDivider />
        <Team />
        <SectionDivider />
        <Resources />
        <SectionDivider variant="strong" />
        <DashboardAccess />
        <SectionDivider variant="subtle" />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
