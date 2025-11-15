import { describe, test, expect, beforeEach } from '@jest/globals';
import reducer, {
  wsConnectionSuccess,
  wsConnectionClosed,
  wsGetMessage,
  wsConnectionError,
  fetchFeedOrdersThunk
} from '../feed-slice';
import { TOrder } from '../../../utils/types';

//начальные состояния для beforeEach
let initialState: {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
  wsConnected: boolean;
};
let mockOrders: TOrder[];

beforeEach(() => {
  initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    isLoading: false,
    error: null,
    wsConnected: false
  };

  mockOrders = [
    {
      _id: '1',
      status: 'done',
      name: 'Готовый бургер',
      createdAt: '2025-11-14T00:00:00.000Z',
      updatedAt: '2025-11-14T00:00:00.000Z',
      number: 1,
      ingredients: ['ing-1']
    }
  ];
});

describe('ws редьюесеры в feedSlice', () => {
  //wsConnectionSuccess ставит wsConnected в true и очищает error
  test('wsConnectionSuccess', () => {
    //начальное состояние
    initialState.error = 'Ошибка';

    const state = reducer(initialState, wsConnectionSuccess());

    expect(state.wsConnected).toBe(true);
    expect(state.error).toBeNull();
  });

  //wsConnectionClosed ставит wsConnected в false
  test('wsConnectionClosed', () => {
    initialState.wsConnected = true;
    const state = reducer(initialState, wsConnectionClosed());

    expect(state.wsConnected).toBe(false);
  });

  //wsGetMessage обновляет orders, total, totalToday, сбрасывает isLoading и error
  test('wsGetMessage', () => {
    //начальное состояние
    initialState.isLoading = true;
    initialState.error = 'Ошибка';

    const state = reducer(
      initialState,
      wsGetMessage({
        orders: mockOrders,
        total: 100,
        totalToday: 10
      })
    );

    //проверяем, что новое состояние (state) соотвутсвует ожиданию
    expect(state.orders).toEqual(mockOrders);
    expect(state.total).toBe(100);
    expect(state.totalToday).toBe(10);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  //wsConnectionError обновляет error и ставит wsConnected в false
  test('wsConnectionError', () => {
    //начальное состояние - соединеие открыто
    initialState.wsConnected = true;

    const state = reducer(initialState, wsConnectionError('Ошибка сокета'));

    expect(state.wsConnected).toBe(false);
    expect(state.error).toBe('Ошибка сокета');
  });
});

//тесты редьюсов ДЛЯ асинхронного действия
describe('fetchFeedOrdersThunk extraReducers', () => {
  //тест проверяет, что происходит, когда действие pending (загрузка начинается) выполняется
  test('pending-когда загрузка начинается', () => {
    //начальное состояние
    initialState.error = 'Ошибка';

    //объект с типом pending
    const action = { type: fetchFeedOrdersThunk.pending.type };

    const state = reducer(initialState, action);

    //загрузка началась - должно быть true и ошибка должна быть удалена
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  //что происходит, когда данные загружены успешно (action типа fulfilled
  test('fulfilled-данные успешно загружены', () => {
    const payload = {
      success: true,
      orders: mockOrders,
      total: 50,
      totalToday: 5
    };

    //действие с типом fulfilled с загруженными данными
    const action = { type: fetchFeedOrdersThunk.fulfilled.type, payload };
    const state = reducer(initialState, action);

    //загрузка завершилась - обнволение данных - ошибка очищена
    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
    expect(state.total).toBe(50);
    expect(state.totalToday).toBe(5);
    expect(state.error).toBeNull();
  });

  //что происходит если success в payload равен false
  test('fulfilled с ошибкой', () => {
    const payload = { success: false };
    const action = { type: fetchFeedOrdersThunk.fulfilled.type, payload };
    const state = reducer(initialState, action);

    //ошибка должна установить, что не удалось получить данные
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Не удалось получить данные');
  });

  //что происходит, когда действие rejected (загрузка не удалась) выполняется
  test('rejected-ошибка загрузки', () => {
    const action = {
      type: fetchFeedOrdersThunk.rejected.type,
      payload: 'Ошибка загрузки'
    };
    const state = reducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });

  //что происходит, если действие rejected без сообщения об ошибке
  test('rejected без сообщения', () => {
    const action = { type: fetchFeedOrdersThunk.rejected.type };
    const state = reducer(initialState, action);

    //ошибка должна получать дефолтное сообщение об ошибке загрузки.
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки ленты');
  });
});
