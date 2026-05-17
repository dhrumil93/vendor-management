import type { Inquiry } from '@/types';

export interface EditInquiryModalProps {
  isOpen: boolean;
  inquiry: Inquiry | null;
  onClose: () => void;
}
