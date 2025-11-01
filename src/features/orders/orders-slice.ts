import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import { getCookie } from '../../utils/cookie';
import { TOrder } from '../../utils/types';

interface OrderState {
  orderNumber: number | null;
  isLoading: boolean;
  userOrders: TOrder[];
  userOrdersLoading: boolean;
  userOrdersError: string | null;
}

const initialState: OrderState = {
  orderNumber: null,
  isLoading: false,
  userOrders: [],
  userOrdersLoading: false,
  userOrdersError: null
};

export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('order/createOrder', async (ingredientIds, { rejectWithValue }) => {
  try {
    const data = await orderBurgerApi(ingredientIds);
    return {
      ...data.order,
      ingredients: data.order.ingredients ?? []
    };
  } catch (err: any) {
    return rejectWithValue(err.message || 'Ошибка при создании заказа');
  }
});

export const fetchUserOrdersThunk = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('orders/fetchUserOrders', async (_, { rejectWithValue }) => {
  try {
    const res = await fetch('https://norma.education-services.ru/api/orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        authorization: `Bearer ${getCookie('accessToken')}`
      }
    });
    const data = await res.json();
    if (data.success) {
      return data.orders.map((order: TOrder) => ({
        ...order,
        ingredients: order.ingredients ?? []
      }));
    }
    return rejectWithValue('Не удалось получить заказы');
  } catch (err: any) {
    return rejectWithValue(err.message || 'Ошибка при загрузке заказов');
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder(state) {
      state.orderNumber = null;
      state.isLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.isLoading = false;
          state.orderNumber = action.payload.number;
          state.userOrders = [action.payload, ...state.userOrders];
        }
      )
      .addCase(createOrder.rejected, (state) => {
        state.isLoading = false;
      })
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
        state.userOrdersError = action.payload ?? 'Ошибка загрузки заказов';
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
