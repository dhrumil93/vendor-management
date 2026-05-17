import { Modal } from '@/components/ui/Modal';
import { EditUserForm } from '@/components/forms';
import type { EditUserModalProps } from './EditUserModal.types';

export const EditUserModal = ({ isOpen, user, onClose }: EditUserModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Edit User" size="lg">
    {user && <EditUserForm key={user.id} user={user} onSuccess={onClose} onCancel={onClose} />}
  </Modal>
);
