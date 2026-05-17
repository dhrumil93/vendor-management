import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import inquiryReducer from '@/features/inquiries/inquirySlice';
import vendorReducer from '@/features/vendors/vendorSlice';
import userReducer from '@/features/users/userSlice';
import roleReducer from '@/features/roles/roleSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    inquiries: inquiryReducer,
    vendors: vendorReducer,
    users: userReducer,
    roles: roleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
