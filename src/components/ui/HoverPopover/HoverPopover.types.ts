import type { ReactNode } from 'react';

export interface HoverPopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right' | 'top' | 'bottom';
  className?: string;
  sideOffset?: number;
}
