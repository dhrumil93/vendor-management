import { Modal } from '@/components/ui/Modal';
import { InquiryFormContent } from '@/components/forms';
import type { CreateInquiryModalProps } from './CreateInquiryModal.types';

export const CreateInquiryModal = ({ isOpen, onClose }: CreateInquiryModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Create New Inquiry" size="lg">
    <InquiryFormContent onSuccess={onClose} onCancel={onClose} />
  </Modal>
);
