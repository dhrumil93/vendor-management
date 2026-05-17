import type { ReactNode } from 'react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  emptyMessage?: string;
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  tableClassName?: string;
  rowClassName?: (row: T) => string;
}
