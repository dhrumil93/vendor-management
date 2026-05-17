import { Menu, LogOut, ChevronDown } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';
import { Dropdown } from '@/components/ui/Dropdown';
import { ROUTES } from '@/utils/routes';
import type { HeaderProps } from './Header.types';

const PAGE_TITLES: Record<string, string> = {
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.INQUIRY_LIST]: 'Inquiries',
  [ROUTES.VENDOR_QUOTE_GET]: 'Vendor Quotes',
  [ROUTES.VENDOR_ACTUAL]: 'Actual Quotes',
  [ROUTES.USERS]: 'Users',
  [ROUTES.ROLES]: 'Roles',
  [ROUTES.ROLES_MAPPING]: 'Role Mapping',
  [ROUTES.ROLES_BRANCH_ACCESS]: 'Branch Access',
  [ROUTES.REPORTS]: 'Reports',
};

export const Header = ({ onMenuClick }: HeaderProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] ?? 'LogiTrack';

  const handleLogout = () => {
    void dispatch(logout());
  };

  return (
    <header className="sticky top-0 z-10 bg-surface border-b border-border px-4 h-16 flex items-center justify-between no-print">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-text-muted hover:bg-surface-raised"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base font-semibold text-text">{pageTitle}</h1>
      </div>

      {user && (
        <Dropdown
          align="right"
          className="w-56"
          trigger={
            <button className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-surface-raised transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-text leading-none">{user.name}</p>
                <p className="text-[11px] text-text-muted leading-none mt-0.5">{user.role}</p>
              </div>
              <ChevronDown size={14} className="text-text-muted ml-0.5 hidden sm:block" />
            </button>
          }
        >
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold text-text">{user.name}</p>
            <p className="text-xs text-text-muted mt-0.5">
              {user.role} &middot; {user.branch}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-danger-light transition-colors"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </Dropdown>
      )}
    </header>
  );
};
