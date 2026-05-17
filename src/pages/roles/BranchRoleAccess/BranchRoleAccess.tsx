import { useState, useRef, useEffect, type FormEvent, type ReactNode } from 'react';
import { ShieldCheck, Eye, PlusCircle, Pencil, Trash2, Check, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { loadRoles, setBranchAccess } from '@/features/roles/roleSlice';
import { FormSkeleton } from '@/components/ui/Skeleton';
import type { Permission, BranchAccess } from '@/types';
import { BRANCHES, PERMISSIONS, ROLE_CHIP_COLORS } from '@/utils/constants';
import { AppSelect } from '@/components/ui/AppSelect';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import type { Column } from '@/components/ui/DataTable';

const permMeta: Record<Permission, { label: string; icon: ReactNode }> = {
  view: { label: 'View', icon: <Eye size={15} /> },
  add: { label: 'Add', icon: <PlusCircle size={15} /> },
  edit: { label: 'Edit', icon: <Pencil size={15} /> },
  delete: { label: 'Delete', icon: <Trash2 size={15} /> },
};

const getRoleChip = (role: string) =>
  ROLE_CHIP_COLORS[role] ?? 'bg-gray-100 text-gray-600 border-gray-200';

const PermDot = ({ active }: { active: boolean }) =>
  active ? (
    <CheckCircle size={16} className="text-success mx-auto" />
  ) : (
    <span className="block w-3.5 h-0.5 bg-border-dark mx-auto rounded-full" />
  );

export const BranchRoleAccess = () => {
  const dispatch = useAppDispatch();
  const roles = useAppSelector((state) => state.roles.roles);
  const branchAccess = useAppSelector((state) => state.roles.branchAccess);
  const loading = useAppSelector((state) => state.roles.loading);

  useEffect(() => {
    void dispatch(loadRoles());
  }, [dispatch]);

  const [selectedRole, setSelectedRole] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedPerms, setSelectedPerms] = useState<Permission[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const formPanelRef = useRef<HTMLDivElement>(null);

  const togglePerm = (perm: Permission) => {
    setSelectedPerms((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm],
    );
  };

  const selectAll = () => setSelectedPerms([...PERMISSIONS]);
  const clearAll = () => setSelectedPerms([]);

  // scroll after re-render, not during state update
  useEffect(() => {
    if (editingId) {
      formPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [editingId]);

  const loadForEdit = (ba: BranchAccess) => {
    setSelectedRole(ba.role);
    setSelectedBranch(ba.branch);
    setSelectedPerms([...ba.permissions]);
    setEditingId(ba.id);
  };

  const syncPermsForSelection = (role: string, branch: string) => {
    if (role && branch) {
      const existing = branchAccess.find((ba) => ba.role === role && ba.branch === branch);
      setSelectedPerms(existing?.permissions ?? []);
      setEditingId(existing?.id ?? null);
    } else {
      setSelectedPerms([]);
      setEditingId(null);
    }
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!selectedRole || !selectedBranch) {
      toast.error('Please select both a role and a branch');
      return;
    }
    try {
      await dispatch(
        setBranchAccess({ role: selectedRole, branch: selectedBranch, permissions: selectedPerms }),
      ).unwrap();
      toast.success('Branch access saved successfully!');
      setEditingId(null);
    } catch {
      toast.error('Failed to save branch access. Please try again.');
    }
  };

  const roleOptions = roles.map((r) => ({ value: r.name, label: r.name }));
  const branchOptions = BRANCHES.map((b) => ({ value: b, label: b }));
  const isEditing = editingId !== null;

  if (loading) return <FormSkeleton fields={6} />;

  const columns: Column<BranchAccess>[] = [
    {
      header: 'Role',
      accessor: (ba) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getRoleChip(ba.role)}`}
        >
          {ba.role}
        </span>
      ),
    },
    {
      header: 'Branch',
      accessor: (ba) => <span className="text-text-muted font-medium">{ba.branch}</span>,
    },
    ...PERMISSIONS.map((p) => ({
      header: permMeta[p].label,
      accessor: (ba: BranchAccess) => <PermDot active={ba.permissions.includes(p)} />,
      className: 'text-center',
    })),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="type-page-title">Branch-wise Role Access</h2>
        <p className="type-page-subtitle mt-1">Define permissions per role per branch</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div
          ref={formPanelRef}
          className={`bg-surface rounded-2xl border p-6 transition-colors ${
            isEditing ? 'border-primary ring-1 ring-primary/30' : 'border-border'
          }`}
        >
          <h3 className="type-section-title mb-4 flex items-center gap-2">
            <ShieldCheck size={18} className="text-primary" />
            {isEditing ? 'Edit Permissions' : 'Set Permissions'}
          </h3>

          <form
            onSubmit={(ev) => {
              void handleSubmit(ev);
            }}
            className="space-y-5"
          >
            <AppSelect
              label="Role"
              value={selectedRole}
              onChange={(v) => {
                setSelectedRole(v);
                syncPermsForSelection(v, selectedBranch);
              }}
              options={roleOptions}
              placeholder="Select role..."
              isSearchable={false}
              required
            />
            <AppSelect
              label="Branch"
              value={selectedBranch}
              onChange={(v) => {
                setSelectedBranch(v);
                syncPermsForSelection(selectedRole, v);
              }}
              options={branchOptions}
              placeholder="Select branch..."
              isSearchable={false}
              required
            />

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="type-label">Permissions</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={selectAll}
                    className="text-xs text-primary hover:underline"
                  >
                    Select All
                  </button>
                  <span className="text-text-faint">·</span>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-xs text-text-faint hover:underline"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {PERMISSIONS.map((perm) => {
                  const active = selectedPerms.includes(perm);
                  const { label, icon } = permMeta[perm];
                  return (
                    <button
                      key={perm}
                      type="button"
                      onClick={() => {
                        togglePerm(perm);
                      }}
                      className={`relative flex items-center gap-2.5 px-3 py-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium text-left ${
                        active
                          ? 'bg-primary-light border-primary text-primary-text shadow-sm'
                          : 'bg-surface-raised border-border-dark text-text-muted hover:border-border-dark hover:bg-surface-raised'
                      }`}
                    >
                      <span className={active ? 'text-primary-text' : 'text-text-faint'}>
                        {icon}
                      </span>
                      {label}
                      {active && (
                        <span className="ml-auto">
                          <Check size={13} className="text-primary-text" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('');
                    setSelectedBranch('');
                    setSelectedPerms([]);
                    setEditingId(null);
                  }}
                  className="text-xs text-text-faint hover:text-text-muted"
                >
                  ✕ Cancel edit
                </button>
              )}
              <Button type="submit" disabled={!selectedRole || !selectedBranch} className="ml-auto">
                {isEditing ? 'Update Access' : 'Save Access'}
              </Button>
            </div>
          </form>
        </div>

        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="type-section-title">Current Access Matrix</h3>
            <p className="type-caption mt-0.5">Click any row to edit it</p>
          </div>

          {branchAccess.length === 0 ? (
            <p className="text-text-faint text-sm text-center py-10">No access rules defined yet</p>
          ) : (
            <DataTable
              data={branchAccess}
              columns={columns}
              rowKey={(ba) => ba.id}
              pageSize={10}
              onRowClick={loadForEdit}
              rowClassName={(ba) =>
                editingId === ba.id ? 'bg-primary-light' : 'hover:bg-surface-raised'
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};
