import type { ReactNode } from 'react';

export interface CardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'purple';
  subtitle?: string;
}
