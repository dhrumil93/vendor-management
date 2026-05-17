import { apiPost } from './client';
import { mockAuthUsers } from '@/data/mockUsers';
import { mockRoles } from '@/data/mockRoles';
import { getMappings } from './userApi';
import type { AuthUser, LoginCredentials, UserRole } from '@/types';

const resolveRole = (userId: string, fallback: UserRole): UserRole => {
  const mapping = getMappings().find((m) => m.userId === userId);
  if (!mapping) return fallback;
  const role = mockRoles.find((r) => r.id === mapping.roleId);
  return (role?.name as UserRole) ?? fallback;
};

export const loginApi = (credentials: LoginCredentials): Promise<AuthUser> =>
  apiPost('/auth/login', credentials, () => {
    const found = mockAuthUsers.find(
      (u) =>
        u.username === credentials.username && u.password === credentials.password && u.isActive,
    );
    if (!found) throw new Error('Invalid username or password.');
    const authUser: AuthUser = {
      id: found.id,
      name: found.name,
      username: found.username,
      email: found.email,
      role: resolveRole(found.id, found.role),
      branch: found.branch,
    };
    return authUser;
  });

export const logoutApi = (): Promise<void> => apiPost('/auth/logout', {}, () => undefined);
