import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import AuthModal from './components/auth/AuthModal';
import MemberDashboard from './components/auth/MemberDashboard';
import AdminDashboard from './components/auth/AdminDashboard';
import AIAssistant from './components/AIAssistant';
import BootSequence from './components/ecosystem/BootSequence';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
      <BootSequence>
        <BrowserRouter>
          <a href="#main-content" className="csi-skip-link">
            Skip to main content
          </a>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/gallery" element={<Navigate to="/#gallery" replace />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <AIAssistant />
          <AuthModal />
          <MemberDashboard />
          <AdminDashboard />
        </BrowserRouter>
      </BootSequence>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
