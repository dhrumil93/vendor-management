import { useState, useEffect } from 'react';
import { Plus, Pencil } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { loadUsers, toggleUserStatus } from '@/features/users/userSlice';
import { ListPageSkeleton } from '@/components/ui/Skeleton';
import { formatDate } from '@/utils/helpers';
import { PAGE_SIZE } from '@/utils/constants';
import { Badge } from '@/components/ui/Badge';
import { Toggle } from '@/components/ui/Toggle';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import type { Column } from '@/components/ui/DataTable';
import type { AppUser } from '@/types';
import { CreateUserModal, EditUserModal } from '@/components/modals';

export const UserScreen = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.users);
  const loading = useAppSelector((state) => state.users.loading);

  useEffect(() => {
    void dispatch(loadUsers());
  }, [dispatch]);

  const [createOpen, setCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);

  if (loading) return <ListPageSkeleton cols={7} />;

  const columns: Column<AppUser>[] = [
    {
      header: 'Name',
      accessor: (u) => <span className="font-medium text-text">{u.name}</span>,
    },
    {
      header: 'Email',
      accessor: (u) => <span className="text-text-muted">{u.email}</span>,
    },
    {
      header: 'Username',
      accessor: (u) => <span className="type-mono">{u.username}</span>,
    },
    {
      header: 'Branch',
      accessor: (u) => <span className="text-text-muted">{u.branch}</span>,
    },
    {
      header: 'Created',
      accessor: (u) => <span className="type-caption">{formatDate(u.createdAt)}</span>,
    },
    {
      header: 'Status',
      accessor: (u) => (
        <Badge
          label={u.isActive ? 'Active' : 'Inactive'}
          className={
            u.isActive ? 'bg-success-light text-success' : 'bg-surface-raised text-text-muted'
          }
        />
      ),
    },
    {
      header: 'Toggle',
      accessor: (u) => (
        <Toggle checked={u.isActive} onChange={() => dispatch(toggleUserStatus(u.id))} size="sm" />
      ),
    },
    {
      header: 'Actions',
      accessor: (u) => (
        <Button
          variant="ghost"
          size="sm"
          title="Edit User"
          onClick={(e) => {
            e.stopPropagation();
            setEditingUser(u);
          }}
        >
          <Pencil size={14} />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="type-page-title">User Management</h2>
          <p className="type-page-subtitle mt-1">Create and manage system users</p>
        </div>
        <Button
          onClick={() => {
            setCreateOpen(true);
          }}
        >
          <Plus size={16} />
          Create User
        </Button>
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="type-section-title">{users.length} Users</h3>
        </div>
        <DataTable
          tableClassName="min-w-[640px]"
          data={users}
          columns={columns}
          rowKey={(u) => u.id}
          pageSize={PAGE_SIZE}
          emptyMessage="No users yet"
        />
      </div>

      <CreateUserModal
        isOpen={createOpen}
        onClose={() => {
          setCreateOpen(false);
        }}
      />
      <EditUserModal
        isOpen={editingUser !== null}
        onClose={() => setEditingUser(null)}
        user={editingUser}
      />
    </div>
  );
};
