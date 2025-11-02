import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { loginUserThunk } from '../../features/user/user-slice';
import { LoginUI } from '@ui-pages';
import { RootState } from '../../services/store';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useAppSelector((state: RootState) => state.user);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');

    try {
      await dispatch(loginUserThunk({ email, password })).unwrap();
      navigate('/profile', { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorText(err.message);
      } else if (typeof err === 'string') {
        setErrorText(err);
      } else {
        setErrorText('Неизвестная ошибка');
      }
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
