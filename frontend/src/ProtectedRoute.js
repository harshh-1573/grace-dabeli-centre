// In frontend/src/ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';

// This component is the security guard for protected pages.
const ProtectedRoute = ({ token, loginPath = "/admin/login", children }) => {
  // Check if the token exists
  if (!token) {
    // If no token found, redirect to the login page
    return <Navigate to={loginPath} replace />;
  }

  // If token exists, render the actual protected component
  return children;
};

export default ProtectedRoute;