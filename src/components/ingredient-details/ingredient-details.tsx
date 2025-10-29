import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { RootState } from '../../services/store';

export const IngredientDetails: FC = () => {
  const { id } = useParams();

  // Достаём список ингредиентов из стора
  const { ingredients, isLoading } = useSelector(
    (state: RootState) => state.ingredients
  );

  // Пока грузится — показываем прелоадер
  if (isLoading || !ingredients.length) {
    return <Preloader />;
  }

  // Ищем нужный ингредиент по id
  const ingredientData = ingredients.find((item) => item._id === id);

  if (!ingredientData) {
    return <p>Ингредиент не найден 😢</p>;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
