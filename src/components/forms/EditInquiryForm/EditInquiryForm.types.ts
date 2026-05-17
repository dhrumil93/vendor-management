import type { Inquiry } from '@/types';

export interface EditInquiryFormProps {
  inquiry: Inquiry;
  onSuccess: () => void;
  onCancel?: () => void;
}
