import { useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';

import { ConstructorPageUI } from '../.././components/ui/pages/constructor-page';
import { fetchIngredientsThunk } from '../../features/ingredients/ingredients-slice';
import { RootState } from '../../services/store';

export const ConstructorPage = () => {
  const dispatch = useDispatch();
  const { ingredients, isLoading } = useSelector(
    (state: RootState) => state.ingredients
  );

  useEffect(() => {
    if (ingredients.length === 0) {
      dispatch(fetchIngredientsThunk());
    }
  }, [dispatch, ingredients.length]);

  return (
    <ConstructorPageUI
      isIngredientsLoading={isLoading}
      ingredients={ingredients}
    />
  );
};
