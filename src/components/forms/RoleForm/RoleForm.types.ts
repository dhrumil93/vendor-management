import type { Role } from '@/types';

export interface RoleFormProps {
  role?: Role;
  onSuccess: () => void;
  onCancel?: () => void;
}
