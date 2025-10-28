import { FC, useMemo } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { RootState } from '../../services/store';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { createOrder, clearOrder } from '../../features/orders/orders-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();

  const { bun, ingredients } = useSelector(
    (state: RootState) => state.constructor
  );
  const { orderNumber, isLoading } = useSelector(
    (state: RootState) => state.orders
  );

  // Считаем общую цену
  const price = useMemo(() => {
    const ingredientsPrice =
      ingredients?.reduce(
        (sum: number, item: TConstructorIngredient) => sum + item.price,
        0
      ) || 0;

    return (bun?.price || 0) * 2 + ingredientsPrice;
  }, [bun, ingredients]);

  // Кнопка оформления заказа
  const onOrderClick = () => {
    if (!bun || isLoading) return;
    const ids = [
      bun._id,
      ...ingredients.map((i: TConstructorIngredient) => i._id)
    ];
    dispatch(createOrder(ids));
  };

  // Закрытие модалки
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
