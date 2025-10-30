import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../../services/store';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  redirectIfAuth?: boolean; // для страниц авторизации (login, register)
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectIfAuth = false
}) => {
  const { user, isInit, isLoading } = useSelector(
    (state: RootState) => state.user
  );

  // Пока данные пользователя загружаются или не инициализированы — показываем loader
  if (!isInit || isLoading) {
    return <div>Загрузка...</div>;
  }

  // Страница авторизации, но пользователь уже авторизован — редирект на /
  if (redirectIfAuth && user) {
    return <Navigate to='/' replace />;
  }

  // Защищённая страница, но пользователь не авторизован — редирект на /login
  if (!redirectIfAuth && !user) {
    return <Navigate to='/login' replace />;
  }

  // Если всё ок — рендерим children или Outlet для вложенных маршрутов
  return <>{children ?? <Outlet />}</>;
};
