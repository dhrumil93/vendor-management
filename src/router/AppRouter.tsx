import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { NotFound } from '@/pages/NotFound';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleProtectedRoute } from './RoleProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageLoader } from '@/components/ui/PageLoader';
import { ROUTES } from '@/utils/routes';

const Login = lazy(() => import('@/pages/auth/Login').then((m) => ({ default: m.Login })));
const Dashboard = lazy(() =>
  import('@/pages/dashboard/Dashboard').then((m) => ({ default: m.Dashboard })),
);
const InquiryList = lazy(() =>
  import('@/pages/inquiry/InquiryList').then((m) => ({ default: m.InquiryList })),
);
const VendorQuoteGet = lazy(() =>
  import('@/pages/vendor/VendorQuoteGet').then((m) => ({ default: m.VendorQuoteGet })),
);
const ActualVendorQuotePage = lazy(() =>
  import('@/pages/vendor/ActualVendorQuote').then((m) => ({
    default: m.ActualVendorQuotePage,
  })),
);
const UserScreen = lazy(() =>
  import('@/pages/users/UserScreen').then((m) => ({ default: m.UserScreen })),
);
const RoleScreen = lazy(() =>
  import('@/pages/roles/RoleScreen').then((m) => ({ default: m.RoleScreen })),
);
const UserRoleMapping = lazy(() =>
  import('@/pages/roles/UserRoleMapping').then((m) => ({ default: m.UserRoleMapping })),
);
const BranchRoleAccess = lazy(() =>
  import('@/pages/roles/BranchRoleAccess').then((m) => ({ default: m.BranchRoleAccess })),
);
const Reports = lazy(() => import('@/pages/reports/Reports').then((m) => ({ default: m.Reports })));
const PrintLayout = lazy(() =>
  import('@/pages/print/PrintLayout').then((m) => ({ default: m.PrintLayout })),
);

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
              <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route path={ROUTES.INQUIRY_LIST} element={<InquiryList />} />
              <Route path={ROUTES.VENDOR_ACTUAL} element={<ActualVendorQuotePage />} />
              <Route path={ROUTES.PRINT} element={<PrintLayout />} />

              <Route
                element={<RoleProtectedRoute allowedRoles={['Admin', 'Manager', 'Operator']} />}
              >
                <Route path={ROUTES.VENDOR_QUOTE_GET} element={<VendorQuoteGet />} />
              </Route>

              <Route element={<RoleProtectedRoute allowedRoles={['Admin', 'Manager']} />}>
                <Route path={ROUTES.REPORTS} element={<Reports />} />
              </Route>

              <Route element={<RoleProtectedRoute allowedRoles={['Admin']} />}>
                <Route path={ROUTES.USERS} element={<UserScreen />} />
                <Route path={ROUTES.ROLES} element={<RoleScreen />} />
                <Route path={ROUTES.ROLES_MAPPING} element={<UserRoleMapping />} />
                <Route path={ROUTES.ROLES_BRANCH_ACCESS} element={<BranchRoleAccess />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
