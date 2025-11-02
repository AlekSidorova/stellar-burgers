import { FC, useEffect } from 'react';
import {
  useAppSelector,
  useAppDispatch,
  RootState
} from '../../services/store';
import { fetchFeedOrdersThunk } from '../../features/feed/feed-slice';
import { FeedUI } from '@ui-pages';
import { Preloader } from '@ui';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  const { orders, isLoading } = useAppSelector(
    (state: RootState) => state.feed
  );

  useEffect(() => {
    dispatch({ type: 'feed/wsConnect' });
    return () => {
      dispatch({ type: 'feed/wsDisconnect' });
    };
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeedOrdersThunk());
  };

  if (isLoading) return <Preloader />;

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
