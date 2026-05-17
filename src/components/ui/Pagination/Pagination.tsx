import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginationProps } from './Pagination.types';

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages: (number | '…')[] = [];
  const delta = 1;
  const start = Math.max(1, currentPage - delta);
  const end = Math.min(totalPages, currentPage + delta);

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push('…');
  }
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages) {
    if (end < totalPages - 1) pages.push('…');
    pages.push(totalPages);
  }

  const pageBtn =
    'inline-flex items-center justify-center min-w-[34px] h-[34px] px-2 rounded border text-sm font-medium transition-colors';

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-border">
      <p className="type-body order-2 sm:order-1">
        {totalItems !== undefined && pageSize !== undefined ? (
          <>
            Showing{' '}
            <span className="font-medium text-text">
              {Math.min((currentPage - 1) * pageSize + 1, totalItems)}
            </span>{' '}
            to{' '}
            <span className="font-medium text-text">
              {Math.min(currentPage * pageSize, totalItems)}
            </span>{' '}
            of <span className="font-medium text-text">{totalItems}</span> entries
          </>
        ) : null}
      </p>

      <nav className="flex items-center gap-1 order-1 sm:order-2" aria-label="Pagination">
        <button
          onClick={() => {
            onPageChange(currentPage - 1);
          }}
          disabled={currentPage === 1}
          className={`${pageBtn} bg-surface text-text-muted border-border-dark hover:bg-bg disabled:opacity-40 disabled:cursor-not-allowed`}
          aria-label="Previous page"
        >
          <ChevronLeft size={15} />
        </button>

        {pages.map((p, idx) =>
          p === '…' ? (
            <span key={`ellipsis-${idx}`} className="px-1.5 text-text-faint text-sm select-none">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => {
                onPageChange(p as number);
              }}
              aria-current={p === currentPage ? 'page' : undefined}
              className={`${pageBtn} ${
                p === currentPage
                  ? 'bg-primary text-white border-primary cursor-default'
                  : 'bg-surface text-text-muted border-border-dark hover:bg-bg'
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => {
            onPageChange(currentPage + 1);
          }}
          disabled={currentPage === totalPages}
          className={`${pageBtn} bg-surface text-text-muted border-border-dark hover:bg-bg disabled:opacity-40 disabled:cursor-not-allowed`}
          aria-label="Next page"
        >
          <ChevronRight size={15} />
        </button>
      </nav>
    </div>
  );
};
