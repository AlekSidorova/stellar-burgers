import { describe, test, expect, beforeEach } from '@jest/globals';
import reducer, {
  clearOrder,
  createOrder,
  fetchUserOrdersThunk
} from '../orders-slice';
import { TOrder } from '../../../utils/types';

//объявление начальных состояний
let initialState: {
  orderNumber: number | null;
  isLoading: boolean;
  userOrders: TOrder[];
  userOrdersLoading: boolean;
  userOrdersError: string | null;
};
let mockOrder: TOrder[];

beforeEach(() => {
  initialState = {
    orderNumber: null,
    isLoading: false,
    userOrders: [],
    userOrdersLoading: false,
    userOrdersError: null
  };

  mockOrder = [
    {
      _id: '1',
      status: 'done',
      name: 'Тестовый бургер',
      createdAt: '2025-11-14T00:00:00.000Z',
      updatedAt: '2025-11-14T00:00:00.000Z',
      number: 1,
      ingredients: ['ing-1']
    }
  ];
});

describe('редьюсеры в orderSlice ', () => {
  //clearOrder очищает orderNumber и isLoading
  test('clearOrder', () => {
    initialState.orderNumber = 123;
    initialState.isLoading = true;

    const state = reducer(initialState, clearOrder());

    //убеждаемся, что orderNumber стал null-isLoading false
    expect(state.orderNumber).toBeNull();
    expect(state.isLoading).toBe(false);
  });
});

describe('extraReducers', () => {
  test('pending-когда создается заказ', () => {
    const action = { type: createOrder.pending.type };
    const state = reducer(initialState, action);

    //проверяем, что isLoading меняется на true, когда создается заказ
    expect(state.isLoading).toBe(true);
  });

  test('fulfilled-когда заказ успешно создан', () => {
    const payload = { number: 123, order: mockOrder[0] };
    const action = { type: createOrder.fulfilled.type, payload };
    const state = reducer(initialState, action);

    //при успешном заказе
    expect(state.isLoading).toBe(false);
    expect(state.orderNumber).toBe(123);
    expect(state.userOrders).toEqual([mockOrder[0]]);
  });

  test('rejected-когда создание заказа не удалось', () => {
    const action = { type: createOrder.rejected.type };
    const state = reducer(initialState, action);

    expect(state.isLoading).toBe(false);
  });
});

describe('fetchUserOrdersThunk', () => {
  test('pending-когда загружаются заказы пользователя', () => {
    initialState.userOrdersError = 'Ошибка';
    const action = { type: fetchUserOrdersThunk.pending.type };
    const state = reducer(initialState, action);

    expect(state.userOrdersLoading).toBe(true);
    expect(state.userOrdersError).toBeNull();
  });

  test('fulfilled-когда заказы пользователя успешно загружены', () => {
    const action = {
      type: fetchUserOrdersThunk.fulfilled.type,
      payload: mockOrder
    };
    const state = reducer(initialState, action);

    //обновляются данные
    expect(state.userOrdersLoading).toBe(false);
    expect(state.userOrders).toEqual(mockOrder);
  });

  test('rejected-когда загрузка заказов не удалась ', () => {
    const action = {
      type: fetchUserOrdersThunk.rejected.type,
      payload: 'Ошибка загрузки'
    };
    const state = reducer(initialState, action);

    expect(state.userOrdersLoading).toBe(false);
    expect(state.userOrdersError).toBe('Ошибка загрузки');
  });

  test('rejected-без сообщения об ошибке', () => {
    const action = { type: fetchUserOrdersThunk.rejected.type };
    const state = reducer(initialState, action);

    expect(state.userOrdersLoading).toBe(false);
    expect(state.userOrdersError).toBe('Ошибка загрузки заказов');
  });
});
