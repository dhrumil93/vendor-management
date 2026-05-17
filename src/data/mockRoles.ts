import type { Role, BranchAccess } from '@/types';

export const mockRoles: Role[] = [
  {
    id: 'r1',
    name: 'Admin',
    description: 'Full access to all modules and branches. Can manage users, roles, and settings.',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'r2',
    name: 'Manager',
    description:
      'Can view, add, and edit inquiries and vendor quotes. Cannot delete or manage users.',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'r3',
    name: 'Operator',
    description: 'Can add and view inquiries. Limited access to vendor quote management.',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'r4',
    name: 'Viewer',
    description: 'Read-only access to all modules. Cannot add, edit, or delete any records.',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
];

export const mockBranchAccess: BranchAccess[] = [
  {
    id: 'ba1',
    role: 'Admin',
    branch: 'Mumbai',
    permissions: ['view', 'add', 'edit', 'delete'],
  },
  {
    id: 'ba2',
    role: 'Admin',
    branch: 'Delhi',
    permissions: ['view', 'add', 'edit', 'delete'],
  },
  {
    id: 'ba3',
    role: 'Manager',
    branch: 'Mumbai',
    permissions: ['view', 'add', 'edit'],
  },
  {
    id: 'ba4',
    role: 'Manager',
    branch: 'Delhi',
    permissions: ['view', 'add', 'edit'],
  },
  {
    id: 'ba5',
    role: 'Operator',
    branch: 'Mumbai',
    permissions: ['view', 'add'],
  },
  {
    id: 'ba6',
    role: 'Operator',
    branch: 'Bangalore',
    permissions: ['view', 'add'],
  },
  {
    id: 'ba7',
    role: 'Viewer',
    branch: 'Mumbai',
    permissions: ['view'],
  },
  {
    id: 'ba8',
    role: 'Viewer',
    branch: 'Chennai',
    permissions: ['view'],
  },
];
