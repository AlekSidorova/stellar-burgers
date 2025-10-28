import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';

interface OrdersState {
  orders: TOrder[];
  isLoading: boolean;
}

const initialState: OrdersState = {
  orders: [],
  isLoading: false
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<TOrder[]>) => {
      state.orders = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  }
});

export const { setOrders, setLoading } = ordersSlice.actions;
export default ordersSlice.reducer;
