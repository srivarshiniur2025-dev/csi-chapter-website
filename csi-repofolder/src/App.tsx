import Navbar from './components/Navbar';
import SiteBackground from './components/SiteBackground';
import Hero from './components/Hero';
import About from './components/About';
import Events from './components/Events';
import Team from './components/Team';
import Contact from './components/Contact';
import ContactCTA from './components/ContactCTA';
import Footer from './components/Footer';
function App() {
  return (
    <div className="site-shell selection:bg-csi-accent selection:text-csi-pale">
      <SiteBackground />
      <Navbar />
      <main>
        <Hero />

        <About />

        <Events />
        <Team />
        <Contact />
      </main>
      <ContactCTA />
      <Footer />
    </div>
  );
}

export default App;
