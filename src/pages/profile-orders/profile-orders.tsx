import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { fetchUserOrdersThunk } from '../../features/orders/orders-slice';
import { fetchIngredientsThunk } from '../../features/ingredients/ingredients-slice';
import { ProfileOrdersUI } from '@ui-pages';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  const { userOrders, userOrdersLoading } = useAppSelector(
    (state: RootState) => state.orders
  );
  const { ingredients } = useAppSelector(
    (state: RootState) => state.ingredients
  );

  useEffect(() => {
    if (!ingredients.length) dispatch(fetchIngredientsThunk());
    dispatch(fetchUserOrdersThunk());
  }, [dispatch, ingredients.length]);

  return <ProfileOrdersUI orders={userOrders} isLoading={userOrdersLoading} />;
};
