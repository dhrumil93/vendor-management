import { Modal } from '@/components/ui/Modal';
import { AssignRoleForm } from '@/components/forms';
import type { AssignRoleModalProps } from './AssignRoleModal.types';

export const AssignRoleModal = ({ isOpen, onClose }: AssignRoleModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Assign Role to User" size="md">
    <AssignRoleForm onSuccess={onClose} onCancel={onClose} />
  </Modal>
);
