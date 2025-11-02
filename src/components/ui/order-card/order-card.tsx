import React, { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import {
  CurrencyIcon,
  FormattedDate
} from '@zlden/react-developer-burger-ui-components';
import styles from './order-card.module.css';

import { OrderCardUIProps } from './type';

export const OrderCardUI: FC<OrderCardUIProps> = memo(
  ({ orderInfo, maxIngredients, locationState }) => (
    <Link
      to={orderInfo.number.toString()}
      relative='path'
      state={locationState}
      className={`p-6 mb-4 mr-2 ${styles.order}`}
    >
      {/* Номер и дата заказа */}
      <div className={styles.order_info}>
        <span className={`text text_type_digits-default ${styles.number}`}>
          #{String(orderInfo.number).padStart(6, '0')}
        </span>
        <span className='text text_type_main-default text_color_inactive'>
          <FormattedDate date={orderInfo.date} />
        </span>
      </div>

      {/* Название заказа */}
      <h4 className={`pt-6 text text_type_main-medium ${styles.order_name}`}>
        {orderInfo.name}
      </h4>

      {/* Контейнер с ингредиентами и суммой */}
      <div className={`pt-6 ${styles.order_content}`}>
        <ul className={styles.ingredients}>
          {orderInfo.ingredientsToShow?.map((ingredient, index) => {
            const zIndex = maxIngredients - index;
            const right = 20 * index;
            return (
              <li
                className={styles.img_wrap}
                style={{ zIndex, right }}
                key={`${ingredient._id}-${index}`}
              >
                <img
                  className={styles.img}
                  src={ingredient.image_mobile}
                  alt={ingredient.name}
                  style={{
                    opacity:
                      orderInfo.remains && maxIngredients === index + 1
                        ? 0.5
                        : 1
                  }}
                />
                {maxIngredients === index + 1 && orderInfo.remains > 0 && (
                  <span
                    className={`text text_type_digits-default ${styles.remains}`}
                  >
                    +{orderInfo.remains}
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        {/* Сумма заказа */}
        <div className={styles.total}>
          <span
            className={`text text_type_digits-default pr-1 ${styles.order_total}`}
          >
            {orderInfo.total}
          </span>
          <CurrencyIcon type='primary' />
        </div>
      </div>
    </Link>
  )
);
