import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrdersData, TOrder } from '../../utils/types';

interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

// Получение всех заказов (лента)
export const fetchFeedOrdersThunk = createAsyncThunk<
  TOrdersData,
  void,
  { rejectValue: string }
>('feed/fetchFeedOrders', async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(
      'https://norma.education-services.ru/api/orders/all',
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json;charset=utf-8' }
      }
    );
    const data = await res.json();
    if (data.success) return data;
    return rejectWithValue('Не удалось получить ленту заказов');
  } catch (err: any) {
    return rejectWithValue(err.message || 'Ошибка при загрузке ленты');
  }
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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

export default feedSlice.reducer;
