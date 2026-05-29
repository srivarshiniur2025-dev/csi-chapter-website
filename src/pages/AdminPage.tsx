import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LandingPage from './LandingPage';

/** Opens admin console overlay; admin role required via ProtectedRoute. */
export default function AdminPage() {
  const { user, openAdmin, closeAdmin } = useAuth();

  useEffect(() => {
    if (user?.role === 'admin') openAdmin();
    return () => closeAdmin();
  }, [user, openAdmin, closeAdmin]);

  if (!user || user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return <LandingPage />;
}
