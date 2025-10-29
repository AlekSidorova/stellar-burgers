import { FC, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = ({ order }) => {
  const location = useLocation();

  /** TODO: взять ингредиенты из Redux store */
  const ingredients: TIngredient[] = [];

  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;

    // Находим данные ингредиентов по их _id
    const ingredientsInfo = order.ingredients
      .map((id) => ingredients.find((ing) => ing._id === id))
      .filter((ing): ing is TIngredient => !!ing);

    // Считаем общую цену
    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date: new Date(order.createdAt) // Date создаётся только для UI
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }} // Location тоже только для UI
    />
  );
};
