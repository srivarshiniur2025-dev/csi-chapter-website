import { useImmersiveMotion } from '../hooks/useImmersiveMotion';
import { useLandingHashScroll } from '../hooks/useLandingHashScroll';
import ImmersiveCursorGlow from '../components/immersive/ImmersiveCursorGlow';
import AmbientNetwork3D from '../components/ecosystem/AmbientNetwork3D';
import Navbar from '../components/Navbar';
import SiteBackground from '../components/SiteBackground';
import Hero from '../components/Hero';
import About from '../components/About';
import PlatformGuide from '../components/platform/PlatformGuide';
import Events from '../components/Events';
import Resources from '../components/Resources';
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
