import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { fetchUserOrdersThunk } from '../../features/orders/orders-slice';
import { fetchIngredientsThunk } from '../../features/ingredients/ingredients-slice';
import { ProfileOrdersUI } from '@ui-pages';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { userOrders, userOrdersLoading } = useSelector(
    (state: RootState) => state.orders
  );
  const { ingredients } = useSelector((state: RootState) => state.ingredients);

  useEffect(() => {
    if (!ingredients.length) dispatch(fetchIngredientsThunk());
    dispatch(fetchUserOrdersThunk());
  }, [dispatch, ingredients.length]);

  return <ProfileOrdersUI orders={userOrders} isLoading={userOrdersLoading} />;
};
