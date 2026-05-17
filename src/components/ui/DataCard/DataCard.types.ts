import type { ReactNode } from 'react';

export interface DataCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'purple';
}
