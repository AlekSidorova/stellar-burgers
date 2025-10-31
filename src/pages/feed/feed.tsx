import { FC, useEffect } from 'react';
import { useSelector, useDispatch, RootState } from '../../services/store';
import { fetchFeedOrdersThunk } from '../../features/feed/feed-slice';
import { FeedUI } from '@ui-pages';
import { Preloader } from '@ui';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state: RootState) => state.feed);

  useEffect(() => {
    dispatch(fetchFeedOrdersThunk());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeedOrdersThunk());
  };

  if (isLoading) return <Preloader />;

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
