import { Middleware } from '@reduxjs/toolkit';
import {
  wsConnectionSuccess,
  wsConnectionClosed,
  wsGetMessage,
  wsConnectionError
} from '../features/feed/feed-slice';
import { RootState } from '../services/store';

const WS_URL = 'wss://norma.education-services.ru/orders/all';

type WsActions = { type: 'feed/wsConnect' } | { type: 'feed/wsDisconnect' };

export const wsMiddleware: Middleware<{}, RootState> = (store) => {
  let socket: WebSocket | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  const RECONNECT_INTERVAL = 5000; // 5 секунд перед переподключением

  const connect = () => {
    socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      console.log('WS connected');
      store.dispatch(wsConnectionSuccess());
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.success) {
          store.dispatch(wsGetMessage(data));
        }
      } catch (err) {
        console.error('Ошибка парсинга WebSocket', err);
      }
    };

    socket.onerror = (err) => {
      console.error('WS error', err);
      store.dispatch(wsConnectionError('Ошибка WebSocket'));
    };

    socket.onclose = (event) => {
      console.warn('WS closed', event);
      store.dispatch(wsConnectionClosed());
      socket = null;

      // Попробуем переподключиться через 5 секунд
      reconnectTimer = setTimeout(connect, RECONNECT_INTERVAL);
    };
  };

  return (next) => (action) => {
    const { dispatch } = store;

    if ((action as WsActions).type === 'feed/wsConnect') {
      // Если уже есть сокет — закрываем, чтобы заново подключить
      if (socket) {
        socket.close();
        socket = null;
      }
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }

      connect();
    }

    if ((action as WsActions).type === 'feed/wsDisconnect') {
      if (socket) {
        socket.close();
        socket = null;
      }
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    }

    return next(action);
  };
};
