import { Modal } from '@/components/ui/Modal';
import { AddVendorForm } from '@/components/forms/AddVendorForm';
import type { AddVendorModalProps } from './AddVendorModal.types';

export const AddVendorModal = ({ isOpen, onClose, onAdd }: AddVendorModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Add Vendor" size="sm">
    <AddVendorForm
      onSuccess={(data) => {
        onAdd(data);
        onClose();
      }}
      onCancel={onClose}
    />
  </Modal>
);
