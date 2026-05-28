import { useImmersiveMotion } from '../hooks/useImmersiveMotion';
import ImmersiveCursorGlow from '../components/immersive/ImmersiveCursorGlow';
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

/** Main marketing site — hero and sections unchanged */
export default function LandingPage() {
  useImmersiveMotion();

  return (
    <div className="site-shell selection:bg-csi-accent selection:text-csi-pale">
      <ImmersiveCursorGlow />
      <SiteBackground />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Events />
        <TechTimeline />
        <Team />
        <Contact />
      </main>
      <ContactCTA />
      <Footer />
    </div>
  );
}
