import type { VendorEntry } from '@/components/forms/AddVendorForm';

export interface AddVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: VendorEntry) => void;
}
