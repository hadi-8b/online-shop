// src/store/auth/authSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import User, { UserType } from '@/models/user';
import type { RootState } from '@/store';

export interface AuthState {
  loading?: boolean;
  user: UserType | User | null;
  phone?: string;
}

const initialState: AuthState = {
  loading: true,
  user: null,
  phone: undefined,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<UserType | null>) => {
      state.user = action.payload ? new User(action.payload) : null;
    },
    updateLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    updatePhone: (state, action: PayloadAction<string | undefined>) => {
      state.phone = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.phone = undefined;
    },
  },
});

export const {
  updateUser,
  updateLoading,
  updatePhone,
  clearAuth,
} = authSlice.actions;

export const selectUser = (state: RootState) => (state.auth.user ? new User(state.auth.user) : null);
export const selectUserLoading = (state: RootState) => state.auth.loading;
export const selectPhone = (state: RootState) => state.auth.phone;

export default authSlice.reducer;
