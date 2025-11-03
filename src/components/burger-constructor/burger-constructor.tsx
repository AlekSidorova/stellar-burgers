import { FC, useMemo } from 'react';
import {
  useAppSelector,
  useAppDispatch,
  RootState
} from '../../services/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { createOrder, clearOrder } from '../../features/orders/orders-slice';
import { clearConstructor } from '../../features/constructor/constructor-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { bun, ingredients } = useAppSelector(
    (state: RootState) => state.burgerConstructor
  );
  const { orderNumber, isLoading } = useAppSelector(
    (state: RootState) => state.orders
  );
  const user = useAppSelector((state: RootState) => state.user.user);

  const price = useMemo(() => {
    const ingredientsPrice =
      ingredients?.reduce(
        (sum: number, item: TConstructorIngredient) => sum + item.price,
        0
      ) || 0;
    return (bun?.price || 0) * 2 + ingredientsPrice;
  }, [bun, ingredients]);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!bun || isLoading) return;

    const ids = [
      bun._id,
      ...ingredients.map((i: TConstructorIngredient) => i._id)
    ];

    dispatch(createOrder(ids)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled' && res.payload) {
        const orderNumber =
          typeof res.payload === 'object' && res.payload !== null
            ? res.payload.number
            : res.payload;

        if (orderNumber) {
          // не делаем navigate
          dispatch(clearConstructor());
        }
      }
    });
  };

  const closeOrderModal = () => dispatch(clearOrder());

  return (
    <BurgerConstructorUI
      constructorItems={{ bun, ingredients: ingredients || [] }}
      price={price}
      orderRequest={isLoading}
      orderModalData={orderNumber ? { number: orderNumber } : null}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
