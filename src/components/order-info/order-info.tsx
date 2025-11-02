import React, { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../services/store';
import { getOrderByNumberApi } from '../../utils/burger-api';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useAppDispatch();
  const ingredients = useAppSelector((state) => state.ingredients.ingredients);

  const [orderData, setOrderData] = React.useState<TOrder | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    if (number) {
      getOrderByNumberApi(Number(number))
        .then((data) => {
          if (data.success && data.orders.length > 0) {
            setOrderData(data.orders[0]);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) acc[item] = { ...ingredient, count: 1 };
        } else acc[item].count++;
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return { ...orderData, ingredientsInfo, date, total };
  }, [orderData, ingredients]);

  if (isLoading || !orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
