import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrdersData, TOrder } from '../../utils/types';

interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
  wsConnected: boolean;
}

// Типы для WebSocket
export type TWSMessage = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
  wsConnected: false
};

// --- AsyncThunk для обычного fetch (при ручном обновлении) ---
export const fetchFeedOrdersThunk = createAsyncThunk<
  TOrdersData,
  void,
  { rejectValue: string }
>('feed/fetchFeedOrders', async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(
      'https://norma.education-services.ru/api/orders/all',
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    );
    const data = await res.json();
    if (data.success) return data;
    return rejectWithValue('Не удалось получить ленту заказов');
  } catch (err: any) {
    return rejectWithValue(err.message || 'Ошибка при загрузке ленты');
  }
});

// --- Слайс ---
const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    // WebSocket успешно подключен
    wsConnectionSuccess(state) {
      state.wsConnected = true;
      state.error = null;
    },
    // WebSocket закрыт
    wsConnectionClosed(state) {
      state.wsConnected = false;
    },
    // Получено новое сообщение через WS
    wsGetMessage(state, action: PayloadAction<TWSMessage>) {
      state.orders = action.payload.orders.map((order) => ({
        ...order,
        ingredients: order.ingredients ?? []
      }));
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.isLoading = false;
      state.error = null;
    },
    // Ошибка WS
    wsConnectionError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.wsConnected = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- fetchFeedOrdersThunk ---
      .addCase(fetchFeedOrdersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchFeedOrdersThunk.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.isLoading = false;
          state.orders = action.payload.orders.map((order) => ({
            ...order,
            ingredients: order.ingredients ?? []
          }));
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
      )
      .addCase(fetchFeedOrdersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка загрузки ленты';
      });
  }
});

export const {
  wsConnectionSuccess,
  wsConnectionClosed,
  wsGetMessage,
  wsConnectionError
} = feedSlice.actions;

export default feedSlice.reducer;
