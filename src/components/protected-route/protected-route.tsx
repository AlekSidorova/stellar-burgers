import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../../services/store';

interface ProtectedRouteProps {
  children?: React.ReactNode; // обязательно для вложенных компонентов
  redirectIfAuth?: boolean; // для страниц авторизации
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectIfAuth = false
}) => {
  const { user, isInit, isLoading } = useSelector(
    (state: RootState) => state.user
  );

  // Пока данные загружаются или ещё не инициализированы
  if (isLoading || !isInit) return <div>Загрузка...</div>;

  // Если это страница авторизации и пользователь уже авторизован — редирект на /
  if (redirectIfAuth && user) return <Navigate to='/' replace />;

  // Если защищённая страница и нет пользователя — редирект на /login
  if (!redirectIfAuth && !user) return <Navigate to='/login' replace />;

  // Рендерим children, если переданы, иначе Outlet для вложенных Route
  return <>{children ?? <Outlet />}</>;
};
