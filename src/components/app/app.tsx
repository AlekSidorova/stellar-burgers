import '../../index.css';
import styles from './app.module.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Provider } from 'react-redux';
import store from '../../services/store';

import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { OrderInfo } from '../order-info/order-info';
import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { AppHeader, Modal } from '@components';
import { ProtectedRoute } from '../protected-route/protected-route';

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <div className={styles.app}>
        <AppHeader />
        <Routes>
          {/* Основные маршруты */}
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />

          {/* Защищённые маршруты для неавторизованных (редирект на / если авторизован) */}
          <Route element={<ProtectedRoute redirectIfAuth />}>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password' element={<ResetPassword />} />
          </Route>

          {/* Личный кабинет — только авторизованные */}
          <Route element={<ProtectedRoute />}>
            <Route path='/profile' element={<Profile />} />
            <Route path='/profile/orders' element={<ProfileOrders />} />
          </Route>

          {/* Модалки */}
          <Route
            path='/feed/:number'
            element={
              <Modal
                title='Информация о заказе'
                onClose={() => window.history.back()}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title='Детали ингредиента'
                onClose={() => window.history.back()}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal
                  title='Информация о заказе'
                  onClose={() => window.history.back()}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path='*' element={<NotFound404 />} />
        </Routes>
      </div>
    </BrowserRouter>
  </Provider>
);

export default App;
