import { FC, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation(); // ← запоминаем текущий маршрут
    const handleAdd = () => {};

    return (
      <Link
        to={`/ingredients/${ingredient._id}`}
        state={{ background: location }} // ← сохраняем, чтобы модалка знала “откуда пришли”
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <BurgerIngredientUI
          ingredient={ingredient}
          count={count}
          locationState={{ background: location }}
          handleAdd={handleAdd}
        />
      </Link>
    );
  }
);
