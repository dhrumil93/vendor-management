import type { AppUser } from '@/types';

export interface EditUserFormProps {
  user: AppUser;
  onSuccess: () => void;
  onCancel?: () => void;
}
