import { Modal } from '@/components/ui/Modal';
import { UserForm } from '@/components/forms';
import type { CreateUserModalProps } from './CreateUserModal.types';

export const CreateUserModal = ({ isOpen, onClose }: CreateUserModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Create New User" size="lg">
    <UserForm onSuccess={onClose} onCancel={onClose} />
  </Modal>
);
