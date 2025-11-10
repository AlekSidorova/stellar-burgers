import { useEffect, useState } from 'react';
import {
  useAppSelector,
  useAppDispatch,
  RootState
} from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { createOrder, clearOrder } from '../../features/orders/orders-slice';
import { fetchIngredientsThunk } from '../../features/ingredients/ingredients-slice';
import { ConstructorPageUI } from '../../components/ui/pages/constructor-page/constructor-page';
import { Modal } from '@components';
import { OrderInfo } from '@components';

export const ConstructorPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { ingredients, isLoading } = useAppSelector(
    (state: RootState) => state.ingredients
  );
  const { orderNumber, isLoading: isOrderLoading } = useAppSelector(
    (state: RootState) => state.orders
  );

  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (ingredients.length === 0) {
      dispatch(fetchIngredientsThunk());
    }
  }, [dispatch, ingredients.length]);

  const handleCreateOrder = () => {
    if (selectedIngredients.length === 0) return alert('Добавьте ингредиенты!');

    // Открываем модалку сразу, номер подтянется позже
    setIsModalOpen(true);

    dispatch(createOrder(selectedIngredients));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    dispatch(clearOrder());
    navigate('/', { replace: true });
  };

  return (
    <>
      <ConstructorPageUI
        isIngredientsLoading={isLoading}
        ingredients={ingredients}
      />

      {isModalOpen && (
        <Modal
          title={orderNumber ? `Ваш заказ №${orderNumber}` : 'Ваш заказ'}
          onClose={handleCloseModal}
        >
          <OrderInfo />
        </Modal>
      )}
    </>
  );
};
