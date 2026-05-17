import { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { loadUsers, removeRoleMapping } from '@/features/users/userSlice';
import { loadRoles } from '@/features/roles/roleSlice';
import { ListPageSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';

import { AssignRoleModal } from '@/components/modals';
import { PAGE_SIZE } from '@/utils/constants';

export const UserRoleMapping = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.users);
  const roles = useAppSelector((state) => state.roles.roles);
  const mappings = useAppSelector((state) => state.users.mappings);
  const loading = useAppSelector((state) => state.users.loading || state.roles.loading);

  useEffect(() => {
    void dispatch(loadUsers());
    void dispatch(loadRoles());
  }, [dispatch]);

  const [assignOpen, setAssignOpen] = useState(false);

  if (loading) return <ListPageSkeleton cols={5} />;

  const getUserName = (id: string) => users.find((u) => u.id === id)?.name ?? '—';
  const getRoleName = (id: string) => roles.find((r) => r.id === id)?.name ?? '—';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="type-page-title">User-Role Mapping</h2>
          <p className="type-page-subtitle mt-1">Assign roles to system users</p>
        </div>
        <Button
          onClick={() => {
            setAssignOpen(true);
          }}
        >
          <Plus size={16} />
          Assign Role
        </Button>
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="type-section-title">Current Mappings</h3>
        </div>
        <DataTable
          data={mappings}
          columns={[
            {
              header: 'User',
              accessor: (m) => (
                <span className="font-medium text-text">{getUserName(m.userId)}</span>
              ),
            },
            {
              header: 'Role',
              accessor: (m) => <span className="text-text-muted">{getRoleName(m.roleId)}</span>,
            },
            {
              header: 'Assigned',
              accessor: (m) => (
                <span className="type-caption">{new Date(m.assignedAt).toLocaleDateString()}</span>
              ),
            },
            {
              header: 'Action',
              accessor: (m) => (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    dispatch(removeRoleMapping(m.id));
                    toast.success('Mapping removed.');
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              ),
            },
          ]}
          rowKey={(m) => m.id}
          pageSize={PAGE_SIZE}
          emptyMessage="No role mappings yet"
        />
      </div>

      <AssignRoleModal
        isOpen={assignOpen}
        onClose={() => {
          setAssignOpen(false);
        }}
      />
    </div>
  );
};
