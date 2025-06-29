import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { sessionManager } from '../../utils/sessionManager';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { user, token } = useSelector(state => state.auth);
  
  // Check if user is authenticated via Redux state
  const isAuthenticated = user && token;
  
  // Fallback check using session manager
  const hasValidSession = sessionManager.isAuthenticated();
  
  if (!isAuthenticated && !hasValidSession) {
    // Redirect to login page with return url
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  return children;
};

export default ProtectedRoute; 