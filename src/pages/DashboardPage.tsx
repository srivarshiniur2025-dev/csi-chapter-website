import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LandingPage from './LandingPage';

/** Opens member dashboard overlay; requires auth via ProtectedRoute. */
export default function DashboardPage() {
  const { user, openDashboard, closeDashboard } = useAuth();

  useEffect(() => {
    if (user) openDashboard();
    return () => closeDashboard();
  }, [user, openDashboard, closeDashboard]);

  if (!user) return <Navigate to="/" replace />;

  return <LandingPage />;
}
