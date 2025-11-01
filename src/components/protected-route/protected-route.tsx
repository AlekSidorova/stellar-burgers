import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../../services/store';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  redirectIfAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectIfAuth = false
}) => {
  const { user, isInit, isLoading } = useSelector(
    (state: RootState) => state.user
  );

  if (!isInit || isLoading) {
    return <div>Загрузка...</div>;
  }

  if (redirectIfAuth && user) {
    return <Navigate to='/' replace />;
  }

  if (!redirectIfAuth && !user) {
    return <Navigate to='/login' replace />;
  }

  return <>{children ?? <Outlet />}</>;
};
