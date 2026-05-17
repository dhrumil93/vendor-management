import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { UserState, AppUser } from '@/types';
import * as userApi from '@/api/userApi';
import type { RootState } from '@/app/store';
import { logoutThunk } from '@/features/auth/authSlice';

export const loadUsers = createAsyncThunk('users/load', async () => {
  const [users, mappings] = await Promise.all([userApi.fetchUsers(), userApi.fetchMappings()]);
  return { users, mappings };
});

export const addUser = createAsyncThunk('users/create', (data: Omit<AppUser, 'id' | 'createdAt'>) =>
  userApi.createUser(data),
);

export const updateUser = createAsyncThunk(
  'users/update',
  (data: Partial<AppUser> & { id: string }) => userApi.updateUser(data),
);

export const toggleUserStatus = createAsyncThunk('users/toggle', (id: string, { getState }) => {
  const user = (getState() as RootState).users.users.find((u) => u.id === id);
  return userApi.setUserActive(id, !user?.isActive);
});

export const assignRole = createAsyncThunk(
  'users/assignRole',
  ({ userId, roleId }: { userId: string; roleId: string }) => userApi.assignRole(userId, roleId),
);

export const removeRoleMapping = createAsyncThunk('users/removeMapping', (id: string) =>
  userApi.removeMapping(id).then(() => id),
);

const initialState: UserState = {
  users: [],
  mappings: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.mappings = action.payload.mappings;
      })
      .addCase(loadUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load users';
      });

    builder
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to create user';
      });

    builder
      .addCase(updateUser.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.users[idx] = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to update user';
      });

    builder
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.users[idx] = action.payload;
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to toggle user status';
      });

    builder
      .addCase(assignRole.fulfilled, (state, action) => {
        const existing = state.mappings.find((m) => m.userId === action.payload.userId);
        if (existing) {
          Object.assign(existing, action.payload);
        } else {
          state.mappings.push(action.payload);
        }
      })
      .addCase(assignRole.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to assign role';
      });

    builder
      .addCase(removeRoleMapping.fulfilled, (state, action) => {
        state.mappings = state.mappings.filter((m) => m.id !== action.payload);
      })
      .addCase(removeRoleMapping.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to remove role mapping';
      });

    builder.addCase(logoutThunk.fulfilled, () => ({ ...initialState }));
  },
});

export default userSlice.reducer;

export const selectUsers = (state: RootState) => state.users.users;
export const selectMappings = (state: RootState) => state.users.mappings;
export const selectUsersLoading = (state: RootState) => state.users.loading;
