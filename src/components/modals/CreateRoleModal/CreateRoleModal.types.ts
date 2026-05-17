import type { Role } from '@/types';

export interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: Role;
}
