import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Verifying admin credentials..." />;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default AdminRoute;
