import React, { JSX, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Props for ProtectedRoute component.
 */
interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}


/**
 * component that protects routes based on authentication and user roles.
 * 
 * - If the user is not logged in, they are redirected to the login page.
 * - If the user is logged in but does not have the required role, they are redirected to the home page.
 * - If the user is authorized, the child components are rendered.
 *
 * @component
 * @param {ProtectedRouteProps} props - The props for the component.
 * @returns {JSX.Element} The protected route component.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }: ProtectedRouteProps): JSX.Element => {
  const location = useLocation();
  const loggedInUser = localStorage.getItem("role"); 

  // If the user is not logged in, store intended URL and redirect to login
  if (!loggedInUser) {
    localStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles are defined and user role is not permitted, redirect to home page
  if (allowedRoles.length > 0 && !allowedRoles.includes(loggedInUser)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
