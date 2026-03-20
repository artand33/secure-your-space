import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user' | 'client';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#E8640A]/20 border-t-[#E8640A] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  if (requiredRole && profile?.role !== requiredRole && profile?.role !== 'admin') {
    // If they aren't authorized for this role and aren't an admin, send them to their own dashboard
    return <Navigate to={profile?.role === 'user' ? '/dashboard/user' : '/dashboard/admin'} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
