import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Dashboards from "../pages/Dashboards";

const AuthRoute = ({ children }) => {
  const token = sessionStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
    

    {children}
 
  </div>
  )
};

export default AuthRoute;