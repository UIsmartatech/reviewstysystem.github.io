import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Layout = () => (
  <div>
    <Outlet />
  </div>
);

export default Layout;