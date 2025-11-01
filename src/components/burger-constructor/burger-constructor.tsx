import { FC, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { RootState } from '../../services/store';
import { useNavigate } from 'react-router-dom'; // 👈 добавляем навигацию
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { createOrder, clearOrder } from '../../features/orders/orders-slice';
import { clearConstructor } from '../../features/constructor/constructor-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // 👈 хук навигации

  const { bun, ingredients } = useSelector(
    (state: RootState) => state.burgerConstructor
  );
  const { orderNumber, isLoading } = useSelector(
    (state: RootState) => state.orders
  );
  const user = useSelector((state: RootState) => state.user.user); // 👈 достаём пользователя

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
    // 👇 проверка авторизации
    if (!user) {
      navigate('/login'); // перенаправляем на страницу логина
      return;
    }

    if (!bun || isLoading) return;

    const ids = [
      bun._id,
      ...ingredients.map((i: TConstructorIngredient) => i._id)
    ];
    dispatch(createOrder(ids));
  };

  // Закрытие модалки
  const closeOrderModal = () => dispatch(clearOrder());

  // Очистка конструктора после успешного заказа
  useEffect(() => {
    if (orderNumber) {
      dispatch(clearConstructor());
    }
  }, [orderNumber, dispatch]);

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
