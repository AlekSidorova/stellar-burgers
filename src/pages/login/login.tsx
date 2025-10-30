import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { loginUserThunk } from '../../features/user/user-slice';
import { LoginUI } from '@ui-pages';
import { RootState } from '../../services/store';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state: RootState) => state.user);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');

    try {
      await dispatch(loginUserThunk({ email, password })).unwrap();
      // после успешного логина редиректим на /profile
      navigate('/profile', { replace: true });
    } catch (err: any) {
      setErrorText(err || 'Ошибка при авторизации');
    }
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};
