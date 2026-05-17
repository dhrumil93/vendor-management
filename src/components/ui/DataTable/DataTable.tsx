import { useState } from 'react';
import { Pagination } from '../Pagination';
import type { DataTableProps } from './DataTable.types';

export function DataTable<T>({
  columns,
  data,
  pageSize = 10,
  emptyMessage = 'No records found.',
  rowKey,
  onRowClick,
  tableClassName = '',
  rowClassName,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const slice = data.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className={`w-full text-sm ${tableClassName}`}>
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.header}
                  className={`px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider ${
                    col.className ?? ''
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {slice.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-text-faint text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              slice.map((row) => (
                <tr
                  key={rowKey(row)}
                  onClick={() => onRowClick?.(row)}
                  className={`transition-colors ${
                    rowClassName ? rowClassName(row) : 'hover:bg-surface-raised'
                  } ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col) => (
                    <td key={col.header} className={`px-4 py-3.5 text-text ${col.className ?? ''}`}>
                      {typeof col.accessor === 'function'
                        ? col.accessor(row)
                        : String(row[col.accessor] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data.length > pageSize && (
        <div className="px-4 border-t border-border">
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={data.length}
            pageSize={pageSize}
          />
        </div>
      )}
    </div>
  );
}
