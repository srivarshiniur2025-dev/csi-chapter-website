import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AuthModal from './components/auth/AuthModal';
import MemberDashboard from './components/auth/MemberDashboard';
import AdminDashboard from './components/auth/AdminDashboard';
import AIAssistant from './components/AIAssistant';
import LandingPage from './pages/LandingPage';
import GalleryPage from './pages/GalleryPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <AIAssistant />
        <AuthModal />
        <MemberDashboard />
        <AdminDashboard />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
