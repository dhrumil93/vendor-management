export interface AsyncState {
  loading: boolean;
  error: string | null;
}

export type UserRole = 'Admin' | 'Manager' | 'Operator' | 'Viewer';

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  branch: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  error: string | null;
}

export type InquiryStatus = 'Pending' | 'In Progress' | 'Approved' | 'Rejected';

export type VehicleType = 'Truck' | 'Mini Truck' | 'Trailer' | 'Container' | 'Tanker';

export type MaterialType =
  | 'Electronics'
  | 'Chemicals'
  | 'Food'
  | 'Machinery'
  | 'Textiles'
  | 'Other';

export interface Inquiry {
  id: string;
  inquiryNo: string;
  date: string;
  customerName: string;
  fromLocation: string;
  toLocation: string;
  vehicleType: VehicleType;
  materialType: MaterialType;
  weight: number;
  notes?: string;
  status: InquiryStatus;
  createdAt: string;
}

export type InquiryFormData = Omit<Inquiry, 'id' | 'inquiryNo' | 'createdAt'>;

export interface InquiryState extends AsyncState {
  inquiries: Inquiry[];
}

export type QuoteStatus = 'Pending' | 'Quoted' | 'Approved' | 'Rejected';

export interface VendorQuoteRequest {
  id: string;
  inquiryId: string;
  inquiryNo: string;
  vendorName: string;
  expectedRate: number;
  remarks?: string;
  createdAt: string;
}

export interface ActualVendorQuote {
  id: string;
  requestId: string;
  inquiryId: string;
  vendorName: string;
  quotedAmount: number;
  transitDays: number;
  notes?: string;
  status: QuoteStatus;
  updatedAt: string;
}

export interface VendorState extends AsyncState {
  quoteRequests: VendorQuoteRequest[];
  actualQuotes: ActualVendorQuote[];
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  branch: string;
  isActive: boolean;
  createdAt: string;
}

export interface UserRoleMapping {
  id: string;
  userId: string;
  roleId: string;
  assignedAt: string;
}

export interface UserState extends AsyncState {
  users: AppUser[];
  mappings: UserRoleMapping[];
}

export type Permission = 'view' | 'add' | 'edit' | 'delete';

export interface Role {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface BranchAccess {
  id: string;
  role: string;
  branch: string;
  permissions: Permission[];
}

export interface RoleState extends AsyncState {
  roles: Role[];
  branchAccess: BranchAccess[];
}
