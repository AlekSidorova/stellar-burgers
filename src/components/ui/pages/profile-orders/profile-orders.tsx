import { FC } from 'react';
import styles from './profile-orders.module.css';
import { ProfileOrdersUIProps } from './type';
import { ProfileMenu, OrdersList } from '@components';

export const ProfileOrdersUI: FC<ProfileOrdersUIProps> = ({
  orders,
  isLoading
}) => (
  <main className={`${styles.main}`}>
    <div className={`mt-30 mr-15 ${styles.menu}`}>
      <ProfileMenu />
    </div>

    <div className={`mt-10 ${styles.orders}`}>
      {isLoading ? (
        <p className='text text_type_main-medium'>Загрузка заказов...</p>
      ) : orders.length > 0 ? (
        <OrdersList orders={orders} />
      ) : (
        <p className='text text_type_main-medium'>История заказов пуста</p>
      )}
    </div>
  </main>
);
