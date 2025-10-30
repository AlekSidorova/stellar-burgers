import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { fetchUserOrdersThunk } from '../../features/orders/orders-slice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  // исправляем на userOrders и userOrdersLoading
  const { userOrders, userOrdersLoading } = useSelector(
    (state: RootState) => state.orders
  );

  useEffect(() => {
    dispatch(fetchUserOrdersThunk());
  }, [dispatch]);

  return <ProfileOrdersUI orders={userOrders} isLoading={userOrdersLoading} />;
};
