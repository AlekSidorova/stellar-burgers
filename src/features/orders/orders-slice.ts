import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';

interface OrderState {
  orderNumber: number | null;
  isLoading: boolean;
}

const initialState: OrderState = {
  orderNumber: null,
  isLoading: false
};

// Создание заказа
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientIds: string[]) => {
    const data = await orderBurgerApi(ingredientIds);
    return data.order.number;
  }
);

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
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
