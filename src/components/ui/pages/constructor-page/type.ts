import { TIngredient } from '@utils-types';

export interface ConstructorPageUIProps {
  isIngredientsLoading: boolean;
  ingredients: TIngredient[]; // <-- вот это добавляем
}
