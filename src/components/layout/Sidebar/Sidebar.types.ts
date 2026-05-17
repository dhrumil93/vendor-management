import type { ReactElement } from 'react';
import type { UserRole } from '@/types';

export interface NavItem {
  kind: 'item';
  path: string;
  label: string;
  icon: ReactElement;
  roles: UserRole[];
}

export interface NavGroup {
  kind: 'group';
  key: string;
  label: string;
  icon: ReactElement;
  roles: UserRole[];
  children: Omit<NavItem, 'kind'>[];
}

export type NavEntry = NavItem | NavGroup;

export interface NavSection {
  heading: string;
  entries: NavEntry[];
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}
