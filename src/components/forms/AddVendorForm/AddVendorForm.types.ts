export interface VendorEntry {
  vendorName: string;
  expectedRate: number;
  remarks: string;
}

export interface AddVendorFormProps {
  onSuccess: (data: VendorEntry) => void;
  onCancel?: () => void;
}
