import { useAppSelector } from '@/app/hooks';
import type { Permission } from '@/types';

export const usePermission = (action: Permission): boolean => {
  const user = useAppSelector((state) => state.auth.user);
  const branchAccess = useAppSelector((state) => state.roles.branchAccess);

  if (!user) return false;

  if (user.role === 'Admin') return true;

  const access = branchAccess.find((ba) => ba.role === user.role && ba.branch === user.branch);

  return access?.permissions.includes(action) ?? false;
};
