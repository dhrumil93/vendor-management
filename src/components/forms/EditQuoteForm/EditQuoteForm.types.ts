import type { ActualVendorQuote } from '@/types';

export interface EditQuoteFormProps {
  quote: ActualVendorQuote;
  onSuccess: () => void;
  onCancel?: () => void;
}
