import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { registerUserThunk } from '../../features/user/user-slice';
import { RegisterUI } from '@ui-pages';
import { RootState } from '../../services/store';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading } = useAppSelector((state: RootState) => state.user);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');

    try {
      await dispatch(
        registerUserThunk({ name: userName, email, password })
      ).unwrap();
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
    <RegisterUI
      userName={userName}
      setUserName={setUserName}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      errorText={errorText}
      isLoading={isLoading}
    />
  );
};
