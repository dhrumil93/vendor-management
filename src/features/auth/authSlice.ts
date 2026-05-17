import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AuthState, LoginCredentials } from '@/types';
import * as authApi from '@/api/authApi';

const STORAGE_KEY = 'logistics_auth_user';

const loadUserFromStorage = (): AuthState['user'] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthState['user']) : null;
  } catch {
    return null;
  }
};

const savedUser = loadUserFromStorage();

export const loginThunk = createAsyncThunk('auth/login', (credentials: LoginCredentials) =>
  authApi.loginApi(credentials),
);

export const logoutThunk = createAsyncThunk('auth/logout', () => authApi.logoutApi());

const initialState: AuthState = {
  user: savedUser,
  isAuthenticated: savedUser !== null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload));
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.error = action.error.message ?? 'Login failed';
      });

    builder
      .addCase(logoutThunk.pending, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        localStorage.removeItem(STORAGE_KEY);
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;

export const login = loginThunk;
export const logout = logoutThunk;

export default authSlice.reducer;
