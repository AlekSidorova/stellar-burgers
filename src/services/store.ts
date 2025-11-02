import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector
} from 'react-redux';

import userReducer from '../features/user/user-slice';
import ordersReducer from '../features/orders/orders-slice';
import ingredientsReducer from '../features/ingredients/ingredients-slice';
import constructorReducer from '../features/constructor/constructor-slice';
import feedReducer from '../features/feed/feed-slice';
import { wsMiddleware } from '../middleware/wsMiddleware';

const rootReducer = combineReducers({
  user: userReducer,
  orders: ordersReducer,
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  feed: feedReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(wsMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useReduxDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

export default store;
