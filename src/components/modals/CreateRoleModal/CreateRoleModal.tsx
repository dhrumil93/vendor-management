import { Modal } from '@/components/ui/Modal';
import { RoleForm } from '@/components/forms';
import type { CreateRoleModalProps } from './CreateRoleModal.types';

export const CreateRoleModal = ({ isOpen, onClose, role }: CreateRoleModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose} title={role ? 'Edit Role' : 'Create New Role'} size="md">
    <RoleForm key={role?.id ?? 'new'} role={role} onSuccess={onClose} onCancel={onClose} />
  </Modal>
);
