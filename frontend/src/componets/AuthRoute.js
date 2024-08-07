import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Dashboards from "../pages/Dashboards";
import { jwtDecode } from "jwt-decode";

const AuthRoute = ({ children }) => {
  const token = sessionStorage.getItem('token');

  let isAuthenticated = false;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Current time in seconds
      if (decoded.exp > currentTime) {
        isAuthenticated = true;
      }
    } catch (e) {
      console.error('Invalid token', e);
    }
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default AuthRoute;