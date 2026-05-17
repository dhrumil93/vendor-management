import type { AppUser } from '@/types';

export interface EditUserModalProps {
  isOpen: boolean;
  user: AppUser | null;
  onClose: () => void;
}
