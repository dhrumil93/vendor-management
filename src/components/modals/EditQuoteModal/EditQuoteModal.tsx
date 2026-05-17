import { Modal } from '@/components/ui/Modal';
import { EditQuoteForm } from '@/components/forms';
import type { EditQuoteModalProps } from './EditQuoteModal.types';

export const EditQuoteModal = ({ isOpen, quote, onClose }: EditQuoteModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Edit Vendor Quote" size="md">
    {quote && <EditQuoteForm key={quote.id} quote={quote} onSuccess={onClose} onCancel={onClose} />}
  </Modal>
);
