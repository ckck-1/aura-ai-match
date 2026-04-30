import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('developer' | 'startup')[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 1. While we are checking /users/me on refresh, show a loader
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // 2. If not logged in, redirect to login but save the current location
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. If a role is required and the user doesn't have it
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // If a developer tries to access a startup page or vice versa
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. Everything is good, render the page
  return <>{children}</>;
}