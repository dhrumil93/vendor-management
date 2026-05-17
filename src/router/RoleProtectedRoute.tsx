import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import type { UserRole } from '@/types';

interface RoleProtectedRouteProps {
  allowedRoles: UserRole[];
}

export const RoleProtectedRoute = ({ allowedRoles }: RoleProtectedRouteProps) => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
