import { useImmersiveMotion } from '../hooks/useImmersiveMotion';
import ImmersiveCursorGlow from '../components/immersive/ImmersiveCursorGlow';
import AmbientNetwork3D from '../components/ecosystem/AmbientNetwork3D';
import Navbar from '../components/Navbar';
import SiteBackground from '../components/SiteBackground';
import Hero from '../components/Hero';
import About from '../components/About';
import Events from '../components/Events';
import TechTimeline from '../components/TechTimeline';
import Team from '../components/Team';
import Contact from '../components/Contact';
import ContactCTA from '../components/ContactCTA';
import Footer from '../components/Footer';
import SectionDivider from '../components/premium/SectionDivider';

/** Main marketing site — cinematic section flow */
export default function LandingPage() {
  useImmersiveMotion();

  return (
    <div className="site-shell selection:bg-csi-accent selection:text-csi-pale">
      <ImmersiveCursorGlow />
      <SiteBackground />
      <AmbientNetwork3D />
      <Navbar />
      <main>
        <Hero />
        <SectionDivider variant="subtle" />
        <About />
        <SectionDivider />
        <Events />
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
