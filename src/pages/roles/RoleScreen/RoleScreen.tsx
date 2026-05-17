import { useState, useEffect } from 'react';
import { Shield, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { loadRoles, deleteRole } from '@/features/roles/roleSlice';
import { formatDate } from '@/utils/helpers';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ListPageSkeleton } from '@/components/ui/Skeleton';
import { CreateRoleModal } from '@/components/modals';
import type { Role } from '@/types';

export const RoleScreen = () => {
  const dispatch = useAppDispatch();
  const roles = useAppSelector((state) => state.roles.roles);
  const loading = useAppSelector((state) => state.roles.loading);

  useEffect(() => {
    void dispatch(loadRoles());
  }, [dispatch]);

  const [createOpen, setCreateOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await dispatch(deleteRole(deleteId)).unwrap();
        toast.success('Role deleted successfully!');
      } catch {
        toast.error('Failed to delete role. Please try again.');
      }
      setDeleteId(null);
    }
  };

  if (loading) return <ListPageSkeleton cols={2} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="type-page-title">Role Management</h2>
          <p className="type-page-subtitle mt-1">Define system roles and their descriptions</p>
        </div>
        <Button
          onClick={() => {
            setCreateOpen(true);
          }}
        >
          <Plus size={16} />
          Create Role
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {roles.map((role) => (
          <div key={role.id} className="bg-surface rounded-2xl border border-border p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary-light rounded-lg">
                <Shield size={18} className="text-primary" />
              </div>
              <h3 className="type-section-title flex-1">{role.name}</h3>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  title="Edit Role"
                  onClick={() => setEditingRole(role)}
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  title="Delete Role"
                  onClick={() => setDeleteId(role.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
            <p className="type-body mb-3">{role.description}</p>
            <p className="type-caption">Created {formatDate(role.createdAt)}</p>
          </div>
        ))}
        {roles.length === 0 && (
          <p className="col-span-4 text-center text-text-faint py-12">No roles defined yet</p>
        )}
      </div>

      <CreateRoleModal
        isOpen={createOpen}
        onClose={() => {
          setCreateOpen(false);
        }}
      />

      <CreateRoleModal
        isOpen={editingRole !== null}
        role={editingRole ?? undefined}
        onClose={() => setEditingRole(null)}
      />

      <Modal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Confirm Delete"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                void handleDelete();
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="type-body">
          Are you sure you want to delete this role? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};
