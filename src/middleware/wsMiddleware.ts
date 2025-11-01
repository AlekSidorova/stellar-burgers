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

  return (next) => (action) => {
    const { dispatch } = store;

    if ((action as WsActions).type === 'feed/wsConnect') {
      if (socket !== null) socket.close();

      socket = new WebSocket(WS_URL);

      socket.onopen = () => dispatch(wsConnectionSuccess());
      socket.onerror = () => dispatch(wsConnectionError('Ошибка WebSocket'));
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.success) dispatch(wsGetMessage(data));
        } catch (err) {
          console.error('Ошибка парсинга WebSocket', err);
        }
      };
      socket.onclose = () => {
        dispatch(wsConnectionClosed());
        socket = null;
      };
    }

    if ((action as WsActions).type === 'feed/wsDisconnect') {
      if (socket) {
        socket.close();
        socket = null;
      }
    }

    return next(action);
  };
};
