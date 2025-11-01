import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TUser, TRegisterData, TLoginData } from '../../utils/types';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '../../utils/burger-api';
import { setCookie } from '../../utils/cookie';

interface UserState {
  user: TUser | null;
  isLoading: boolean;
  isInit: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  isInit: false,
  error: null
};

export const loginUserThunk = createAsyncThunk(
  'user/login',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const res = await loginUserApi(data);
      localStorage.setItem('refreshToken', res.refreshToken);
      setCookie('accessToken', res.accessToken.split('Bearer ')[1]);
      return res.user;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const registerUserThunk = createAsyncThunk(
  'user/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const res = await registerUserApi(data);
      localStorage.setItem('refreshToken', res.refreshToken);
      setCookie('accessToken', res.accessToken.split('Bearer ')[1]);
      return res.user;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getUserThunk = createAsyncThunk(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserApi();
      return res.user;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateUserThunk = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const res = await updateUserApi(data);
      return res.user;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const logoutThunk = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  setCookie('accessToken', '');
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    init: (state) => {
      state.isInit = true;
    },
    logout: (state) => {
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loginUserThunk.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.isLoading = false;
          state.user = action.payload;
        }
      )
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Register
      .addCase(registerUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        registerUserThunk.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.isLoading = false;
          state.user = action.payload;
        }
      )
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Get User
      .addCase(getUserThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getUserThunk.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.isLoading = false;
          state.isInit = true;
          state.user = action.payload;
        }
      )
      .addCase(getUserThunk.rejected, (state) => {
        state.isLoading = false;
        state.isInit = true;
      })

      // Update User
      .addCase(updateUserThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        updateUserThunk.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.isLoading = false;
          state.user = action.payload;
        }
      )
      .addCase(updateUserThunk.rejected, (state) => {
        state.isLoading = false;
      })

      // Logout
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
      });
  }
});

export const { init } = userSlice.actions;
export default userSlice.reducer;
