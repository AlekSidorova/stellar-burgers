import { describe, test, expect, beforeEach } from '@jest/globals';
import reducer, {
  init,
  logout,
  loginUserThunk,
  registerUserThunk,
  getUserThunk,
  updateUserThunk,
  logoutThunk
} from '../user-slice';
import { TUser } from '../../../utils/types';

let initialState: {
  user: TUser | null;
  isLoading: boolean;
  isInit: boolean;
  error: string | null;
};

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test Sanya'
};

beforeEach(() => {
  initialState = {
    user: null,
    isLoading: false,
    isInit: false,
    error: null
  };
});

describe('редьюсеры в userSlice', () => {
  //init — устанавливает isInit в true
  test('init', () => {
    const state = reducer(initialState, init());

    //проверяем, что состояние инициализировано
    expect(state.isInit).toBe(true);
  });

  //logout сбрасывает user
  test('logout', () => {
    initialState.user = mockUser;
    const state = reducer(initialState, logout());

    expect(state.user).toBeNull();
  });
});

describe('loginUserThunk', () => {
  test('pending-когда происходит вход в систему', () => {
    initialState.error = 'Ошибка';
    const state = reducer(initialState, { type: loginUserThunk.pending.type });

    //проверяем, когда isLoading очищается (запрос на вход в систему находится в процессе выполения)
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('fulfilled-когда вход в систему успешен', () => {
    const state = reducer(initialState, {
      type: loginUserThunk.fulfilled.type,
      payload: mockUser
    });

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(mockUser);
  });

  test('rejected-когда вход в систему не удался', () => {
    const state = reducer(initialState, {
      type: loginUserThunk.rejected.type,
      payload: 'Ошибка логина'
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка логина');
  });
});

describe('registerUserThunk', () => {
  test('pending-когда начинается регистрация', () => {
    initialState.error = 'Ошибка';
    const state = reducer(initialState, {
      type: registerUserThunk.pending.type
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('fulfilled-когда регистрация прошла успешно', () => {
    const state = reducer(initialState, {
      type: registerUserThunk.fulfilled.type,
      payload: mockUser
    });

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(mockUser);
  });

  test('rejected-когда регистрация не удалась', () => {
    const state = reducer(initialState, {
      type: registerUserThunk.rejected.type,
      payload: 'Ошибка регистрации'
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка регистрации');
  });
});

describe('getUserThunk', () => {
  test('pending-когда загружаются данные пользователя', () => {
    const state = reducer(initialState, { type: getUserThunk.pending.type });

    expect(state.isLoading).toBe(true);
  });

  test('fulfilled-когда пользователь успешно загружен', () => {
    const state = reducer(initialState, {
      type: getUserThunk.fulfilled.type,
      payload: mockUser
    });

    expect(state.isLoading).toBe(false);
    expect(state.isInit).toBe(true);
    expect(state.user).toEqual(mockUser);
  });

  test('rejected-когда запрос на получение не удался', () => {
    const state = reducer(initialState, {
      type: getUserThunk.rejected.type
    });

    expect(state.isInit).toBe(true);
    expect(state.isLoading).toBe(false);
  });
});

describe('updateUserThunk', () => {
  test('pending-когда обновляются данные пользователя', () => {
    const state = reducer(initialState, {
      type: updateUserThunk.pending.type
    });

    expect(state.isLoading).toBe(true);
  });

  test('fulfilled-когда обновление прошло успешно', () => {
    const state = reducer(initialState, {
      type: updateUserThunk.fulfilled.type,
      payload: mockUser
    });

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(mockUser);
  });

  test('rejected-когда обновление не удалось', () => {
    const state = reducer(initialState, {
      type: updateUserThunk.rejected.type
    });

    expect(state.isLoading).toBe(false);
  });
});

describe('logoutThunk', () => {
  test('fulfilled-сбрасывает user', () => {
    initialState.user = mockUser;

    const state = reducer(initialState, {
      type: logoutThunk.fulfilled.type
    });

    expect(state.user).toBeNull();
  });
});
