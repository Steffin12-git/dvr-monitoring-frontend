import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const loggedInUser = localStorage.getItem('role');
  const location = useLocation();

  if (!loggedInUser) {
    localStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(loggedInUser)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
