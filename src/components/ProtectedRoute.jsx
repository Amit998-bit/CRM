import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, redirectPath = '/login', children }) => {
  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page
    return <Navigate to={redirectPath} replace />;
  }

  // If authenticated, render the child components or the Outlet for nested routes
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
