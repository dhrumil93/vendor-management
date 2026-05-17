import { useState, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard,
  ClipboardList,
  Truck,
  Users,
  Shield,
  BarChart3,
  ChevronRight,
  ChevronLeft,
  X,
} from 'lucide-react';
import { useAppSelector } from '@/app/hooks';
import { HoverPopover } from '@/components/ui/HoverPopover';
import { ROUTES } from '@/utils/routes';
import type { NavItem, NavGroup, NavSection, SidebarProps } from './Sidebar.types';

const navSections: NavSection[] = [
  {
    heading: 'OVERVIEW',
    entries: [
      {
        kind: 'item',
        path: ROUTES.DASHBOARD,
        label: 'Dashboard',
        icon: <LayoutDashboard size={18} />,
        roles: ['Admin', 'Manager', 'Operator', 'Viewer'],
      },
      {
        kind: 'item',
        path: ROUTES.INQUIRY_LIST,
        label: 'Inquiry',
        icon: <ClipboardList size={18} />,
        roles: ['Admin', 'Manager', 'Operator', 'Viewer'],
      },
    ],
  },
  {
    heading: 'OPERATIONS',
    entries: [
      {
        kind: 'group',
        key: 'vendor',
        label: 'Vendor Quotes',
        icon: <Truck size={18} />,
        roles: ['Admin', 'Manager', 'Operator', 'Viewer'],
        children: [
          {
            path: ROUTES.VENDOR_QUOTE_GET,
            label: 'Get Quotes',
            icon: <Truck size={16} />,
            roles: ['Admin', 'Manager', 'Operator'],
          },
          {
            path: ROUTES.VENDOR_ACTUAL,
            label: 'Actual Quotes',
            icon: <Truck size={16} />,
            roles: ['Admin', 'Manager', 'Operator', 'Viewer'],
          },
        ],
      },
    ],
  },
  {
    heading: 'ADMINISTRATION',
    entries: [
      {
        kind: 'item',
        path: ROUTES.USERS,
        label: 'Users',
        icon: <Users size={18} />,
        roles: ['Admin'],
      },
      {
        kind: 'group',
        key: 'roles',
        label: 'Roles',
        icon: <Shield size={18} />,
        roles: ['Admin'],
        children: [
          {
            path: ROUTES.ROLES,
            label: 'Role List',
            icon: <Shield size={16} />,
            roles: ['Admin'],
          },
          {
            path: ROUTES.ROLES_MAPPING,
            label: 'Role Mapping',
            icon: <Shield size={16} />,
            roles: ['Admin'],
          },
          {
            path: ROUTES.ROLES_BRANCH_ACCESS,
            label: 'Branch Access',
            icon: <Shield size={16} />,
            roles: ['Admin'],
          },
        ],
      },
    ],
  },
  {
    heading: 'ANALYTICS',
    entries: [
      {
        kind: 'item',
        path: ROUTES.REPORTS,
        label: 'Reports',
        icon: <BarChart3 size={18} />,
        roles: ['Admin', 'Manager'],
      },
    ],
  },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const Sidebar = ({ isOpen, onClose, collapsed, onToggleCollapse }: SidebarProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();

  const activeGroupKey = useMemo<string | null>(() => {
    for (const section of navSections) {
      for (const entry of section.entries) {
        if (entry.kind === 'group') {
          const isChildActive = entry.children.some(
            (child) =>
              location.pathname === child.path || location.pathname.startsWith(child.path + '/'),
          );
          if (isChildActive) return entry.key;
        }
      }
    }
    return null;
  }, [location.pathname]);

  const [extraOpenKey, setExtraOpenKey] = useState<string | null>(null);

  const isGroupOpen = (key: string) =>
    !collapsed && (key === activeGroupKey || key === extraOpenKey);

  const handleGroupToggle = (key: string) => {
    if (key === activeGroupKey) return;
    setExtraOpenKey((prev) => (prev === key ? null : key));
  };

  const linkBase =
    'flex items-center rounded-lg text-sm font-medium transition-colors duration-150';
  const linkActive = 'bg-sidebar-active-bg text-sidebar-active font-semibold';
  const linkInactive = 'text-sidebar-text hover:bg-sidebar-hover hover:text-white';

  const linkLayout = collapsed
    ? 'flex-col justify-center px-0 py-2.5 w-full gap-1'
    : 'px-3 py-2.5 gap-3';

  const renderItem = (entry: NavItem) => (
    <li key={entry.path}>
      <NavLink
        to={entry.path}
        end
        onClick={onClose}
        title={collapsed ? entry.label : undefined}
        className={({ isActive }) =>
          `${linkBase} ${linkLayout} ${isActive ? linkActive : linkInactive}`
        }
      >
        {entry.icon}
        {collapsed ? (
          <span className="text-[10px] leading-none text-center px-1 text-sidebar-muted/80">
            {entry.label}
          </span>
        ) : (
          <span>{entry.label}</span>
        )}
      </NavLink>
    </li>
  );

  const renderGroup = (entry: NavGroup) => {
    const visibleChildren = entry.children.filter((c) => user && c.roles.includes(user.role));
    if (visibleChildren.length === 0) return null;

    const groupOpen = isGroupOpen(entry.key);
    const isActiveGroup = activeGroupKey === entry.key;

    if (collapsed) {
      const trigger = (
        <div
          title={entry.label}
          className={`${linkBase} flex-col justify-center px-0 py-2.5 w-full gap-1 cursor-default ${isActiveGroup ? linkActive : linkInactive}`}
        >
          <div className="relative">
            {entry.icon}
            <ChevronRight
              size={10}
              className="absolute -right-3 top-1/2 -translate-y-1/2 text-sidebar-muted opacity-60"
            />
          </div>
          <span className="text-[10px] leading-none text-center px-1 text-sidebar-muted/80">
            {entry.label}
          </span>
        </div>
      );

      return (
        <li key={entry.key} className="w-full">
          <HoverPopover trigger={trigger} align="right" className="w-48 p-1.5">
            <div className="flex flex-col gap-0.5">
              <div className="px-3 py-1.5 mb-1 text-[11px] font-semibold text-sidebar-muted uppercase tracking-wider border-b border-border-dark">
                {entry.label}
              </div>
              {visibleChildren.map((child) => (
                <NavLink
                  key={child.path}
                  to={child.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'text-primary bg-primary-lighter font-medium'
                        : 'text-text-muted hover:text-white hover:bg-sidebar-hover'
                    }`
                  }
                >
                  {child.label}
                </NavLink>
              ))}
            </div>
          </HoverPopover>
        </li>
      );
    }

    return (
      <li key={entry.key}>
        <button
          type="button"
          onClick={() => handleGroupToggle(entry.key)}
          className={`w-full ${linkBase} ${linkLayout} ${isActiveGroup ? 'text-white' : linkInactive} justify-between`}
        >
          <span className="flex items-center gap-3">
            {entry.icon}
            {entry.label}
          </span>
          <motion.span
            animate={{ rotate: groupOpen ? 90 : 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            style={{ display: 'flex' }}
          >
            <ChevronRight size={15} className="text-sidebar-muted" />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {groupOpen && (
            <motion.ul
              key={`${entry.key}-children`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              style={{ overflow: 'hidden' }}
              className="mt-0.5 ml-4 pl-2 border-l-2 border-sidebar-hover space-y-0.5"
            >
              {visibleChildren.map((child) => (
                <li key={child.path}>
                  <NavLink
                    to={child.path}
                    end
                    onClick={onClose}
                    className={({ isActive }) =>
                      `${linkBase} ${linkLayout} ${isActive ? linkActive : linkInactive}`
                    }
                  >
                    {child.icon}
                    {child.label}
                  </NavLink>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </li>
    );
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sidebar-overlay"
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <aside
        className={[
          'fixed top-0 left-0 h-screen bg-sidebar border-r border-sidebar-border z-30',
          'flex flex-col transition-all duration-300',
          'lg:translate-x-0 lg:relative lg:z-20 lg:h-screen',
          collapsed ? 'w-64 lg:w-[88px]' : 'w-64',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <div
          className={`flex items-center border-b border-sidebar-border h-16 shrink-0 ${
            collapsed ? 'justify-center px-0' : 'justify-between px-6'
          }`}
        >
          <NavLink to={ROUTES.DASHBOARD} onClick={onClose} className="flex items-center gap-2">
            <div className="bg-primary text-white p-1.5 rounded-lg shrink-0">
              <Truck size={18} />
            </div>
            {!collapsed && <span className="font-bold text-white text-sm">LogiTrack</span>}
          </NavLink>
          {!collapsed && (
            <button
              onClick={onClose}
              className="lg:hidden text-sidebar-muted hover:text-white"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <nav className="flex-1 min-h-0 px-3 py-4 overflow-y-auto">
          <ul className="space-y-0.5">
            {navSections.map((section) => {
              const visibleEntries = section.entries.filter((entry) =>
                user ? entry.roles.includes(user.role) : false,
              );
              if (visibleEntries.length === 0) return null;

              return (
                <li key={section.heading}>
                  {!collapsed && (
                    <div className="px-3 pt-5 pb-1">
                      <span className="text-[10px] font-semibold tracking-widest uppercase text-sidebar-muted/60 select-none">
                        {section.heading}
                      </span>
                    </div>
                  )}
                  {collapsed && <div className="pt-3" />}
                  <ul className="space-y-0.5">
                    {visibleEntries.map((entry) =>
                      entry.kind === 'item' ? renderItem(entry) : renderGroup(entry),
                    )}
                  </ul>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={[
            'hidden lg:flex items-center justify-center',
            'absolute -right-3 top-[52px] z-[99]',
            'h-6 w-6 rounded-full',
            'bg-surface border border-border-dark',
            'text-text-muted hover:text-white hover:bg-primary hover:border-primary',
            'transition-colors duration-150 shadow-md',
          ].join(' ')}
        >
          {collapsed ? (
            <ChevronRight size={13} strokeWidth={2.5} />
          ) : (
            <ChevronLeft size={13} strokeWidth={2.5} />
          )}
        </button>
      </aside>
    </>
  );
};
