import { FC, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../services/store';
import { fetchFeedOrdersThunk } from '../../features/feed/feed-slice';
import { fetchIngredientsThunk } from '../../features/ingredients/ingredients-slice';
import { FeedUI } from '@ui-pages';
import { Preloader } from '@ui';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  const { orders, isLoading } = useAppSelector((state) => state.feed);
  const { ingredients, isLoading: isIngredientsLoading } = useAppSelector(
    (state) => state.ingredients
  );
  const { isInit } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!isInit) return;

    // Подгружаем ингредиенты, если их нет
    if (!ingredients.length) {
      dispatch(fetchIngredientsThunk());
    }

    // Подгружаем заказы
    dispatch(fetchFeedOrdersThunk());

    // Подключение WS
    dispatch({ type: 'feed/wsConnect' });

    return () => {
      dispatch({ type: 'feed/wsDisconnect' });
    };
  }, [dispatch, isInit, ingredients.length]);

  // Показываем прелоадер пока подгружаются данные
  if (isLoading || isIngredientsLoading || !isInit) return <Preloader />;

  if (!orders || orders.length === 0) return <p>Нет заказов</p>;

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => dispatch(fetchFeedOrdersThunk())}
    />
  );
};
