export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  INQUIRY_LIST: '/inquiry/list',
  VENDOR_QUOTE_GET: '/vendor/quote-get',
  VENDOR_ACTUAL: '/vendor/actual-quotes',
  USERS: '/users',
  ROLES: '/roles',
  ROLES_MAPPING: '/roles/mapping',
  ROLES_BRANCH_ACCESS: '/roles/branch-access',
  REPORTS: '/reports',
  PRINT: '/print/:type/:id',
} as const;

export type PrintType = 'inquiry' | 'vendor';

export const printPath = (type: PrintType, id: string): string => `/print/${type}/${id}`;
