import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Layout = () => (
  <div>
  <header>
    {/* Your header content */}
  </header>
  <main>
    <Outlet />
  </main>
  <footer>
    {/* Your footer content */}
  </footer>
</div>
);

export default Layout;