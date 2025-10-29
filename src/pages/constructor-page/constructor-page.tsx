import { useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';

import { ConstructorPageUI } from '../.././components/ui/pages/constructor-page';
import { fetchIngredients } from '../../features/ingredients/ingredients-slice';
import { RootState } from '../../services/store';

export const ConstructorPage = () => {
  const dispatch = useDispatch();
  const { ingredients, isLoading } = useSelector(
    (state: RootState) => state.ingredients
  );

  useEffect(() => {
    if (ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  return (
    <ConstructorPageUI
      isIngredientsLoading={isLoading}
      ingredients={ingredients}
    />
  );
};
