import { AuthProvider } from './contexts/AuthContext';
import AuthModal from './components/auth/AuthModal';
import MemberDashboard from './components/auth/MemberDashboard';
import AdminPanel from './components/auth/AdminPanel';
import Navbar from './components/Navbar';
import SiteBackground from './components/SiteBackground';
import Hero from './components/Hero';
import About from './components/About';
import Events from './components/Events';
import TechTimeline from './components/TechTimeline';
import Team from './components/Team';
import Contact from './components/Contact';
import ContactCTA from './components/ContactCTA';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
function App() {
  return (
    <AuthProvider>
      <div className="site-shell selection:bg-csi-accent selection:text-csi-pale">
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
        <AIAssistant />
        <AuthModal />
        <MemberDashboard />
        <AdminPanel />
      </div>
    </AuthProvider>
  );
}

export default App;
