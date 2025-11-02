import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../services/store';

import { ConstructorPageUI } from '../.././components/ui/pages/constructor-page';
import { fetchIngredientsThunk } from '../../features/ingredients/ingredients-slice';
import { RootState } from '../../services/store';

export const ConstructorPage = () => {
  const dispatch = useAppDispatch();
  const { ingredients, isLoading } = useAppSelector(
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
