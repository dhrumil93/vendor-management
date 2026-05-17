import type { VehicleType, MaterialType, InquiryStatus, QuoteStatus, UserRole } from '@/types';

export const VEHICLE_TYPES: VehicleType[] = [
  'Truck',
  'Mini Truck',
  'Trailer',
  'Container',
  'Tanker',
];

export const MATERIAL_TYPES: MaterialType[] = [
  'Electronics',
  'Chemicals',
  'Food',
  'Machinery',
  'Textiles',
  'Other',
];

export const INQUIRY_STATUSES: InquiryStatus[] = ['Pending', 'In Progress', 'Approved', 'Rejected'];

export const QUOTE_STATUSES: QuoteStatus[] = ['Pending', 'Quoted', 'Approved', 'Rejected'];

export const USER_ROLES: UserRole[] = ['Admin', 'Manager', 'Operator', 'Viewer'];

export const BRANCHES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad'] as const;

export type Branch = (typeof BRANCHES)[number];

export const PERMISSIONS = ['view', 'add', 'edit', 'delete'] as const;

export const PAGE_SIZE = 10;

export const DATE_LOCALE = 'en-IN';
export const CURRENCY_LOCALE = 'en-IN';
export const CURRENCY_CODE = 'INR';

export const ROLE_CHIP_COLORS: Record<string, string> = {
  Admin: 'bg-blue-100 text-blue-800 border-blue-200',
  Manager: 'bg-amber-100 text-amber-800 border-amber-200',
  Operator: 'bg-purple-100 text-purple-800 border-purple-200',
  Viewer: 'bg-gray-100 text-gray-600 border-gray-200',
};
