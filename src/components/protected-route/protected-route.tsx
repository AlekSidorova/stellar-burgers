import React from 'react';
import { useAppSelector } from '../../services/store';
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
  const { user, isInit, isLoading } = useAppSelector(
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
