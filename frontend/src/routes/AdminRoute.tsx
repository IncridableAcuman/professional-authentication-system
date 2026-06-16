import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const AdminRoute: React.FC = () => {
  const { isAuthenticated, userRole } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    userRole: state.userRole
  }));

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return userRole === 'ADMIN' ? <Outlet /> : <Navigate to="/profile" replace />;
};