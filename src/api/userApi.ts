import { apiGet, apiPost, apiPatch, apiDelete } from './client';
import { mockAppUsers } from '@/data/mockUsers';
import { generateId } from '@/utils/helpers';
import type { AppUser, UserRoleMapping } from '@/types';

const _users: AppUser[] = [...mockAppUsers];
let _mappings: UserRoleMapping[] = [
  { id: 'm1', userId: 'u1', roleId: 'r1', assignedAt: '2024-01-01T00:00:00.000Z' },
  { id: 'm2', userId: 'u2', roleId: 'r2', assignedAt: '2024-01-10T00:00:00.000Z' },
  { id: 'm3', userId: 'u3', roleId: 'r3', assignedAt: '2024-02-01T00:00:00.000Z' },
  { id: 'm4', userId: 'u4', roleId: 'r4', assignedAt: '2024-02-15T00:00:00.000Z' },
];

export const fetchUsers = (): Promise<AppUser[]> => apiGet('/users', () => [..._users]);

export const getMappings = (): UserRoleMapping[] => [..._mappings];

export const fetchMappings = (): Promise<UserRoleMapping[]> =>
  apiGet('/users/mappings', () => getMappings());

export const createUser = (data: Omit<AppUser, 'id' | 'createdAt'>): Promise<AppUser> =>
  apiPost('/users', data, () => {
    const user: AppUser = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    _users.push(user);
    return { ...user };
  });

export const updateUser = (data: Partial<AppUser> & { id: string }): Promise<AppUser> =>
  apiPatch(`/users/${data.id}`, data, () => {
    const idx = _users.findIndex((u) => u.id === data.id);
    if (idx === -1) throw new Error('User not found');
    const updatedItem = { ..._users[idx], ...data };
    _users[idx] = updatedItem;
    return { ...updatedItem };
  });

export const setUserActive = (id: string, isActive: boolean): Promise<AppUser> =>
  apiPatch(`/users/${id}/active`, { isActive }, () => {
    const idx = _users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error('User not found');
    const updatedItem = { ..._users[idx], isActive };
    _users[idx] = updatedItem;
    return { ...updatedItem };
  });

export const assignRole = (userId: string, roleId: string): Promise<UserRoleMapping> =>
  apiPost('/users/mappings', { userId, roleId }, () => {
    const idx = _mappings.findIndex((m) => m.userId === userId);
    if (idx !== -1) {
      const updatedItem = { ..._mappings[idx], roleId, assignedAt: new Date().toISOString() };
      _mappings[idx] = updatedItem;
      return { ...updatedItem };
    }
    const mapping: UserRoleMapping = {
      id: generateId(),
      userId,
      roleId,
      assignedAt: new Date().toISOString(),
    };
    _mappings.push(mapping);
    return { ...mapping };
  });

export const removeMapping = (id: string): Promise<void> =>
  apiDelete(`/users/mappings/${id}`, () => {
    _mappings = _mappings.filter((m) => m.id !== id);
  });
