import { FC, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { addIngredient } from '../../features/constructor/constructor-slice';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    // функция добавления ингредиента
    const handleAddClick = () => {
      const ingredientWithId = { ...ingredient, id: crypto.randomUUID() };
      dispatch(addIngredient(ingredientWithId));
    };

    return (
      <Link
        to={`/ingredients/${ingredient._id}`}
        state={{ background: location }}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <BurgerIngredientUI
          ingredient={ingredient}
          count={count}
          handleAdd={handleAddClick}
        />
      </Link>
    );
  }
);
