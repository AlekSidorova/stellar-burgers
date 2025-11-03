import { FC, useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../services/store';
import { getOrderByNumberApi } from '../../utils/burger-api';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const { orderNumber } = useAppSelector((state) => state.orders);
  const ingredients = useAppSelector((state) => state.ingredients.ingredients);

  const [orderData, setOrderData] = useState<TOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Если открыли через modal после создания заказа
  const orderId = number ? Number(number) : orderNumber;

  useEffect(() => {
    if (!orderId) return;

    setIsLoading(true);
    getOrderByNumberApi(orderId)
      .then((data) => {
        if (data.success && data.orders.length > 0) {
          setOrderData(data.orders[0]);
        }
      })
      .finally(() => setIsLoading(false));
  }, [orderId]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, id) => {
        const ingredient = ingredients.find((ing) => ing._id === id);
        if (!ingredient) return acc;

        if (!acc[id]) {
          acc[id] = { ...ingredient, count: 1 };
        } else {
          acc[id].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    const date = new Date(orderData.createdAt);

    return { ...orderData, ingredientsInfo, total, date };
  }, [orderData, ingredients]);

  if (isLoading || !orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
