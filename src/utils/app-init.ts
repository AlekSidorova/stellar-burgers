import { store } from '../services/store';
import { getUserThunk } from '../features/user/user-slice';
import { deleteCookie } from './cookie';

export async function initializeApp() {
  const accessToken = document.cookie.includes('accessToken')
    ? document.cookie.split('accessToken=')[1].split(';')[0]
    : undefined;

  const refreshToken = localStorage.getItem('refreshToken');

  // Если токены старые или отсутствуют — очистим полностью
  if (!accessToken || !refreshToken) {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
    return;
  }

  // Пробуем подгрузить пользователя
  try {
    await store.dispatch(getUserThunk());
    console.log('Пользователь успешно загружен');
  } catch (err) {
    console.warn('Ошибка загрузки пользователя, очищаем токены', err);
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  }
}
