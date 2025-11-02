import { FC, useMemo } from 'react';
import { useAppSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { TIngredient, TOrder } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { OrderCardProps } from './type';
import { useLocation } from 'react-router-dom';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = ({ order }) => {
  const ingredients: TIngredient[] = useAppSelector(
    (state: RootState) => state.ingredients.ingredients
  );

  const location = useLocation();

  const orderInfo = useMemo(() => {
    // Если ингредиенты ещё не загружены, используем пустой массив
    const ingredientsInfo = (order.ingredients ?? [])
      .map((id) => ingredients.find((ing) => ing._id === id))
      .filter((ing): ing is TIngredient => !!ing);

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow: ingredientsInfo.slice(0, maxIngredients),
      remains: Math.max(0, ingredientsInfo.length - maxIngredients),
      total: ingredientsInfo.reduce((sum, ing) => sum + ing.price, 0),
      date: new Date(order.createdAt)
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
};
