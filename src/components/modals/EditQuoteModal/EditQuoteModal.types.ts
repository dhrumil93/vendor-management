import type { ActualVendorQuote } from '@/types';

export interface EditQuoteModalProps {
  isOpen: boolean;
  quote: ActualVendorQuote | null;
  onClose: () => void;
}
