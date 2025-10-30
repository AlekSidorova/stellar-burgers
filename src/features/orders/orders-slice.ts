import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

interface OrderState {
  orderNumber: number | null;
  isLoading: boolean;
  userOrders: TOrder[]; // массив заказов пользователя
  userOrdersLoading: boolean; // статус загрузки заказов
  userOrdersError: string | null; // ошибка загрузки заказов
}

const initialState: OrderState = {
  orderNumber: null,
  isLoading: false,
  userOrders: [],
  userOrdersLoading: false,
  userOrdersError: null
};

// Thunk для создания нового заказа
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientIds: string[]) => {
    const data = await orderBurgerApi(ingredientIds);
    return data.order.number;
  }
);

// Thunk для получения заказов пользователя
export const fetchUserOrdersThunk = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('orders/fetchUserOrders', async (_, { rejectWithValue }) => {
  try {
    const orders = await getOrdersApi();
    return orders;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Ошибка при загрузке заказов');
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderNumber = null;
      state.isLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Создание нового заказа
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.orderNumber = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(createOrder.rejected, (state) => {
        state.isLoading = false;
      })

      // Получение заказов пользователя
      .addCase(fetchUserOrdersThunk.pending, (state) => {
        state.userOrdersLoading = true;
        state.userOrdersError = null;
      })
      .addCase(
        fetchUserOrdersThunk.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.userOrdersLoading = false;
          state.userOrders = action.payload;
        }
      )
      .addCase(fetchUserOrdersThunk.rejected, (state, action) => {
        state.userOrdersLoading = false;
        state.userOrdersError = action.payload as string;
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
