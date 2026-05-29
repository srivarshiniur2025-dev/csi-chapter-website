import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardSkeleton } from '../ui/Skeleton';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

/** Route guard — Firebase session (or local demo) with role check. */
export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading, authReady } = useAuth();
  const location = useLocation();

  if (!authReady || loading) {
    return (
      <div className="csi-route-loading">
        <DashboardSkeleton />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace state={{ from: location.pathname, auth: 'login' }} />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
