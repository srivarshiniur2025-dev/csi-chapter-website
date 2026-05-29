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
import PlatformGuide from '../components/platform/PlatformGuide';
import Events from '../components/Events';
import Resources from '../components/Resources';
import Community from '../components/community/Community';
import Gallery from '../components/Gallery';
import TechTimeline from '../components/TechTimeline';
import Team from '../components/Team';
import Contact from '../components/Contact';
import ContactCTA from '../components/ContactCTA';
import Footer from '../components/Footer';
import SectionDivider from '../components/premium/SectionDivider';

/** Main marketing site — cinematic section flow */
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
      <main className="site-main">
        <Hero />
        <SectionDivider variant="subtle" />
        <About />
        <SectionDivider />
        <PlatformGuide />
        <SectionDivider />
        <Events />
        <SectionDivider />
        <Gallery />
        <SectionDivider />
        <Resources />
        <SectionDivider />
        <Community />
        <SectionDivider variant="strong" />
        <TechTimeline />
        <SectionDivider />
        <Team />
        <SectionDivider variant="subtle" />
        <Contact />
      </main>
      <ContactCTA />
      <Footer />
    </div>
  );
}
