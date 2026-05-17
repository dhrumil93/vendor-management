import { apiGet, apiPost, apiDelete, apiPatch } from './client';
import { mockRoles, mockBranchAccess } from '@/data/mockRoles';
import { generateId } from '@/utils/helpers';
import type { Role, BranchAccess, Permission } from '@/types';

let _roles: Role[] = [...mockRoles];
const _branchAccess: BranchAccess[] = [...mockBranchAccess];

export const fetchRoles = (): Promise<Role[]> => apiGet('/roles', () => [..._roles]);

export const fetchBranchAccess = (): Promise<BranchAccess[]> =>
  apiGet('/roles/branch-access', () => [..._branchAccess]);

export const createRole = (data: Omit<Role, 'id' | 'createdAt'>): Promise<Role> =>
  apiPost('/roles', data, () => {
    const role: Role = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    _roles.push(role);
    return { ...role };
  });

export const updateRole = (data: {
  id: string;
  name: string;
  description: string;
}): Promise<Role> =>
  apiPatch(`/roles/${data.id}`, data, () => {
    const idx = _roles.findIndex((r) => r.id === data.id);
    if (idx === -1) throw new Error('Role not found');
    _roles[idx] = { ..._roles[idx], name: data.name, description: data.description };
    return { ..._roles[idx] };
  });

export const deleteRole = (id: string): Promise<void> =>
  apiDelete(`/roles/${id}`, () => {
    _roles = _roles.filter((r) => r.id !== id);
  });

export const setBranchAccess = (
  role: string,
  branch: string,
  permissions: Permission[],
): Promise<BranchAccess> =>
  apiPatch('/roles/branch-access', { role, branch, permissions }, () => {
    const idx = _branchAccess.findIndex((ba) => ba.role === role && ba.branch === branch);
    if (idx !== -1) {
      const updatedItem = { ..._branchAccess[idx], permissions: [...permissions] };
      _branchAccess[idx] = updatedItem;
      return { ...updatedItem };
    }
    const entry: BranchAccess = { id: generateId(), role, branch, permissions: [...permissions] };
    _branchAccess.push(entry);
    return { ...entry };
  });
