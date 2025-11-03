import { useEffect, useState } from 'react';
import {
  useAppSelector,
  useAppDispatch,
  RootState
} from '../../services/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { createOrder, clearOrder } from '../../features/orders/orders-slice';
import { fetchIngredientsThunk } from '../../features/ingredients/ingredients-slice';
import { ConstructorPageUI } from '../../components/ui/pages/constructor-page/constructor-page';
import { Modal } from '@components';
import { OrderInfo } from '@components';

export const ConstructorPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

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

    dispatch(createOrder(selectedIngredients)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setIsModalOpen(true);
      }
    });
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

      {/* Кнопка оформления заказа */}
      <div className='pl-5 pr-5 mt-5'>
        <button
          className='button text text_type_main-default'
          disabled={isOrderLoading}
          onClick={handleCreateOrder}
        >
          {isOrderLoading ? 'Оформление...' : 'Оформить заказ'}
        </button>
      </div>

      {/* Модалка с информацией о заказе */}
      {isModalOpen && orderNumber && (
        <Modal title={`Ваш заказ №${orderNumber}`} onClose={handleCloseModal}>
          <OrderInfo />
        </Modal>
      )}
    </>
  );
};
