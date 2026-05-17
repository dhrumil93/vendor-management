import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Edit3, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { loadVendorData, updateQuoteStatus } from '@/features/vendors/vendorSlice';
import { usePermission } from '@/hooks/usePermission';
import { loadInquiries } from '@/features/inquiries/inquirySlice';
import { ListPageSkeleton } from '@/components/ui/Skeleton';
import type { ActualVendorQuote } from '@/types';
import { getQuoteStatusColor, formatCurrency, formatDate } from '@/utils/helpers';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import type { Column } from '@/components/ui/DataTable';
import { EditQuoteModal } from '@/components/modals';
import { printPath } from '@/utils/routes';

const PAGE_SIZE = 10;

export const ActualVendorQuotePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const actualQuotes = useAppSelector((state) => state.vendors.actualQuotes);
  const inquiries = useAppSelector((state) => state.inquiries.inquiries);
  const loading = useAppSelector((state) => state.vendors.loading || state.inquiries.loading);
  const canEdit = usePermission('edit');

  useEffect(() => {
    void dispatch(loadVendorData());
    void dispatch(loadInquiries());
  }, [dispatch]);

  const [editingQuote, setEditingQuote] = useState<ActualVendorQuote | null>(null);

  const getInquiryNo = (inquiryId: string) =>
    inquiries.find((i) => i.id === inquiryId)?.inquiryNo ?? '—';

  const handleApprove = async (quote: ActualVendorQuote) => {
    try {
      await dispatch(updateQuoteStatus({ id: quote.id, status: 'Approved' })).unwrap();
      toast.success(`${quote.vendorName} quote approved!`);
    } catch {
      toast.error('Failed to update quote status.');
    }
  };

  const handleReject = async (quote: ActualVendorQuote) => {
    try {
      await dispatch(updateQuoteStatus({ id: quote.id, status: 'Rejected' })).unwrap();
      toast.error(`${quote.vendorName} quote rejected.`);
    } catch {
      toast.error('Failed to update quote status.');
    }
  };

  if (loading) return <ListPageSkeleton cols={8} />;

  const pendingCount = actualQuotes.filter(
    (q) => q.status === 'Pending' || q.status === 'Quoted',
  ).length;

  const columns: Column<ActualVendorQuote>[] = [
    {
      header: 'Inquiry No',
      accessor: (quote) => (
        <span className="font-medium text-primary whitespace-nowrap">
          {getInquiryNo(quote.inquiryId)}
        </span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      header: 'Vendor',
      accessor: 'vendorName',
      className: 'font-medium text-text',
    },
    {
      header: 'Quoted Amount',
      accessor: (quote) => (
        <span className="font-semibold text-text whitespace-nowrap">
          {formatCurrency(quote.quotedAmount)}
        </span>
      ),
    },
    {
      header: 'Transit Days',
      accessor: (quote) => (
        <span className="text-text-muted whitespace-nowrap">{quote.transitDays} days</span>
      ),
    },
    {
      header: 'Notes',
      accessor: (quote) => (
        <span className="type-caption max-w-xs truncate block">{quote.notes ?? '—'}</span>
      ),
    },
    {
      header: 'Status',
      accessor: (quote) => (
        <Badge label={quote.status} className={getQuoteStatusColor(quote.status)} />
      ),
    },
    {
      header: 'Updated',
      accessor: (quote) => (
        <span className="type-caption whitespace-nowrap">{formatDate(quote.updatedAt)}</span>
      ),
    },
    {
      header: 'Actions',
      accessor: (quote) => {
        const needsDecision = quote.status === 'Pending' || quote.status === 'Quoted';
        return (
          <div className="flex items-center gap-1.5 flex-nowrap">
            <Button
              variant="ghost"
              size="sm"
              title="Print vendor quotes for inquiry"
              onClick={() => {
                void navigate(printPath('vendor', quote.inquiryId));
              }}
            >
              <Printer size={13} />
            </Button>
            {canEdit && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  title="Edit quote"
                  onClick={() => setEditingQuote(quote)}
                >
                  <Edit3 size={13} />
                </Button>
                <span className="w-px h-4 bg-border-dark" />
                {quote.status !== 'Approved' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Approve this quote"
                    onClick={() => handleApprove(quote)}
                    className={
                      needsDecision
                        ? 'bg-success-light text-success border border-success/30 hover:bg-success-light/70'
                        : 'text-text-faint hover:bg-success-light hover:text-success'
                    }
                  >
                    <CheckCircle size={12} />
                    {needsDecision ? 'Approve' : ''}
                  </Button>
                )}
                {quote.status !== 'Rejected' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Reject this quote"
                    onClick={() => handleReject(quote)}
                    className={
                      needsDecision
                        ? 'bg-danger-light text-danger border border-danger/30 hover:bg-danger-light/70'
                        : 'text-text-faint hover:bg-danger-light hover:text-danger'
                    }
                  >
                    <XCircle size={12} />
                    {needsDecision ? 'Reject' : ''}
                  </Button>
                )}
              </>
            )}
          </div>
        );
      },
      className: 'whitespace-nowrap',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="type-page-title">Actual Vendor Quotes</h2>
        <p className="type-page-subtitle mt-1">Review and manage quoted amounts from vendors</p>
      </div>

      {pendingCount > 0 && (
        <div className="flex items-center gap-3 bg-warning-light border border-warning/30 rounded-xl px-4 py-3 text-sm text-warning">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
          <span>
            <span className="font-semibold">{pendingCount}</span> quote
            {pendingCount > 1 ? 's' : ''} awaiting your decision — approve or reject below.
          </span>
        </div>
      )}

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <DataTable
          tableClassName="min-w-[780px]"
          data={actualQuotes}
          columns={columns}
          rowKey={(quote) => quote.id}
          pageSize={PAGE_SIZE}
          emptyMessage="No vendor quotes yet"
        />
      </div>

      <EditQuoteModal
        key={editingQuote?.id ?? 'none'}
        isOpen={editingQuote !== null}
        quote={editingQuote}
        onClose={() => {
          setEditingQuote(null);
        }}
      />
    </div>
  );
};
