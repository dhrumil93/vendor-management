import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RoleState, Role, Permission } from '@/types';
import * as roleApi from '@/api/roleApi';
import type { RootState } from '@/app/store';
import { logoutThunk } from '@/features/auth/authSlice';

export const loadRoles = createAsyncThunk('roles/load', async () => {
  const [roles, branchAccess] = await Promise.all([
    roleApi.fetchRoles(),
    roleApi.fetchBranchAccess(),
  ]);
  return { roles, branchAccess };
});

export const addRole = createAsyncThunk('roles/create', (data: Omit<Role, 'id' | 'createdAt'>) =>
  roleApi.createRole(data),
);

export const updateRole = createAsyncThunk(
  'roles/update',
  (data: { id: string; name: string; description: string }) => roleApi.updateRole(data),
);

export const deleteRole = createAsyncThunk('roles/delete', (id: string) =>
  roleApi.deleteRole(id).then(() => id),
);

export const setBranchAccess = createAsyncThunk(
  'roles/setBranchAccess',
  ({ role, branch, permissions }: { role: string; branch: string; permissions: Permission[] }) =>
    roleApi.setBranchAccess(role, branch, permissions),
);

const initialState: RoleState = {
  roles: [],
  branchAccess: [],
  loading: false,
  error: null,
};

const roleSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload.roles;
        state.branchAccess = action.payload.branchAccess;
      })
      .addCase(loadRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load roles';
      });

    builder
      .addCase(addRole.fulfilled, (state, action) => {
        state.roles.push(action.payload);
      })
      .addCase(addRole.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to create role';
      });

    builder
      .addCase(updateRole.fulfilled, (state, action) => {
        const idx = state.roles.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) state.roles[idx] = action.payload;
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to update role';
      });

    builder
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.roles = state.roles.filter((r) => r.id !== action.payload);
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to delete role';
      });

    builder
      .addCase(setBranchAccess.fulfilled, (state, action) => {
        const idx = state.branchAccess.findIndex(
          (ba) => ba.role === action.payload.role && ba.branch === action.payload.branch,
        );
        if (idx !== -1) {
          state.branchAccess[idx] = action.payload;
        } else {
          state.branchAccess.push(action.payload);
        }
      })
      .addCase(setBranchAccess.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to save branch access';
      });

    builder.addCase(logoutThunk.fulfilled, () => ({ ...initialState }));
  },
});

export default roleSlice.reducer;

export const selectRoles = (state: RootState) => state.roles.roles;
export const selectBranchAccess = (state: RootState) => state.roles.branchAccess;
export const selectRolesLoading = (state: RootState) => state.roles.loading;
