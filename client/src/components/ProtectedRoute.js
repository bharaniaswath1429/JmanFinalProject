import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const ProtectedRoute = ({ element: Component, allowedRoles }) => {
  const token = localStorage.getItem('authToken');
  const decoded = token ? jwtDecode(token) : null;

  if (!token || !decoded) {
    return <Navigate to="/" />;
  }

  const userRole = decoded.role;

  if (allowedRoles.includes(userRole)) {
    return <Component />;
  }
  return <Navigate to="/error" />;
};

export default ProtectedRoute;
