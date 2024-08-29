import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import LeftSidebar from '@/components/left-sidebar';

import { useAuthState } from '../states/auth.state';

const PrivateRoute: React.FC = () => {
  const { isAuthenticated } = useAuthState();

  return isAuthenticated ? (
    <LeftSidebar>
      <Outlet />
    </LeftSidebar>
  ) : (
    <Navigate replace to={'/'} />
  );
};

export default PrivateRoute;
