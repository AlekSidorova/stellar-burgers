import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../services/store';
import { RootState } from '../../services/store';
import { updateUserThunk } from '../../features/user/user-slice';
import { ProfileUI } from '@ui-pages';

export const Profile: FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.user);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [updateUserError, setUpdateUserError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  }, [user]);

  const isFormChanged =
    user &&
    (formValue.name !== user.name ||
      formValue.email !== user.email ||
      !!formValue.password);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setUpdateUserError(null);

    try {
      await dispatch(updateUserThunk(formValue)).unwrap();
      setFormValue((prev) => ({ ...prev, password: '' }));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setUpdateUserError(err.message);
      } else if (typeof err === 'string') {
        setUpdateUserError(err);
      } else {
        setUpdateUserError('Неизвестная ошибка');
      }
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!user) return null;

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={!!isFormChanged}
      updateUserError={updateUserError ?? undefined}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      handleInputChange={handleInputChange}
    />
  );
};
