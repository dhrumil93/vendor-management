import type { Inquiry } from '@/types';

export interface ViewInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: Inquiry | null;
}
