import { FC, memo } from 'react';
import styles from './burger-ingredient.module.css';
import {
  Counter,
  CurrencyIcon,
  AddButton
} from '@zlden/react-developer-burger-ui-components';
import { TBurgerIngredientUIProps } from './type';

export const BurgerIngredientUI: FC<TBurgerIngredientUIProps> = memo(
  ({ ingredient, count, handleAdd }) => {
    const { image, price, name } = ingredient;

    return (
      //вставляем data-cy для тестов
      <li className={styles.container} data-cy='ingredient'>
        {count && <Counter count={count} />}
        <img className={styles.img} src={image} alt={name} />
        <div className={`${styles.cost} mt-2 mb-2`}>
          <p className='text text_type_digits-default mr-2'>{price}</p>
          <CurrencyIcon type='primary' />
        </div>
        <p className={`text text_type_main-default ${styles.text}`}>{name}</p>

        <AddButton
          text='Добавить'
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAdd();
          }}
          extraClass={`${styles.addButton} mt-8`}
        />
      </li>
    );
  }
);
