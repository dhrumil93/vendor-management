import { Modal } from '@/components/ui/Modal';
import { EditInquiryForm } from '@/components/forms';
import type { EditInquiryModalProps } from './EditInquiryModal.types';

export const EditInquiryModal = ({ isOpen, inquiry, onClose }: EditInquiryModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Edit Inquiry" size="lg">
    {inquiry && (
      <EditInquiryForm key={inquiry.id} inquiry={inquiry} onSuccess={onClose} onCancel={onClose} />
    )}
  </Modal>
);
