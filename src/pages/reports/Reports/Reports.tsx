import { useState, useMemo, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer, Filter } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { loadInquiries } from '@/features/inquiries/inquirySlice';
import { loadVendorData } from '@/features/vendors/vendorSlice';
import { TableSkeleton } from '@/components/ui/Skeleton';
import type { InquiryStatus, QuoteStatus, Inquiry, ActualVendorQuote } from '@/types';
import { INQUIRY_STATUSES, QUOTE_STATUSES } from '@/utils/constants';
import {
  getInquiryStatusColor,
  getQuoteStatusColor,
  formatDate,
  formatCurrency,
} from '@/utils/helpers';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AppSelect } from '@/components/ui/AppSelect';
import { DataTable } from '@/components/ui/DataTable';
import type { Column } from '@/components/ui/DataTable';

type Tab = 'inquiry' | 'vendor';

export const Reports = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<Tab>('inquiry');
  const printRef = useRef<HTMLDivElement>(null);

  const inquiries = useAppSelector((state) => state.inquiries.inquiries);
  const actualQuotes = useAppSelector((state) => state.vendors.actualQuotes);
  const loading = useAppSelector((state) => state.inquiries.loading || state.vendors.loading);

  useEffect(() => {
    void dispatch(loadInquiries());
    void dispatch(loadVendorData());
  }, [dispatch]);

  const [inqSearch, setInqSearch] = useState('');
  const [inqStatus, setInqStatus] = useState('');
  const [inqDateFrom, setInqDateFrom] = useState('');
  const [inqDateTo, setInqDateTo] = useState('');

  const [vndSearch, setVndSearch] = useState('');
  const [vndStatus, setVndStatus] = useState('');

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchSearch =
        !inqSearch ||
        inq.customerName.toLowerCase().includes(inqSearch.toLowerCase()) ||
        inq.inquiryNo.toLowerCase().includes(inqSearch.toLowerCase());
      const matchStatus = !inqStatus || inq.status === (inqStatus as InquiryStatus);
      const matchFrom = !inqDateFrom || inq.date >= inqDateFrom;
      const matchTo = !inqDateTo || inq.date <= inqDateTo;
      return matchSearch && matchStatus && matchFrom && matchTo;
    });
  }, [inquiries, inqSearch, inqStatus, inqDateFrom, inqDateTo]);

  const filteredQuotes = useMemo(() => {
    return actualQuotes.filter((q) => {
      const matchSearch =
        !vndSearch || q.vendorName.toLowerCase().includes(vndSearch.toLowerCase());
      const matchStatus = !vndStatus || q.status === (vndStatus as QuoteStatus);
      return matchSearch && matchStatus;
    });
  }, [actualQuotes, vndSearch, vndStatus]);

  const handlePrint = useReactToPrint({ contentRef: printRef });

  const inqStatusOptions = INQUIRY_STATUSES.map((s) => ({ value: s, label: s }));
  const vndStatusOptions = QUOTE_STATUSES.map((s) => ({ value: s, label: s }));

  if (loading) return <TableSkeleton rows={8} cols={7} />;

  const inqColumns: Column<Inquiry>[] = [
    {
      header: 'Inq No',
      accessor: (inq) => <span className="font-medium text-primary">{inq.inquiryNo}</span>,
    },
    {
      header: 'Date',
      accessor: (inq) => <span className="text-text-muted">{formatDate(inq.date)}</span>,
    },
    { header: 'Customer', accessor: 'customerName' },
    {
      header: 'Route',
      accessor: (inq) => (
        <span className="text-text-muted whitespace-nowrap">
          {inq.fromLocation} &rarr; {inq.toLocation}
        </span>
      ),
    },
    {
      header: 'Vehicle',
      accessor: (inq) => <span className="text-text-muted">{inq.vehicleType}</span>,
    },
    {
      header: 'Weight',
      accessor: (inq) => <span className="text-text-muted">{inq.weight.toLocaleString()} kg</span>,
    },
    {
      header: 'Status',
      accessor: (inq) => <Badge label={inq.status} className={getInquiryStatusColor(inq.status)} />,
    },
  ];

  const vndColumns: Column<ActualVendorQuote>[] = [
    {
      header: 'Vendor',
      accessor: (q) => <span className="font-medium text-text">{q.vendorName}</span>,
    },
    {
      header: 'Quoted Amount',
      accessor: (q) => (
        <span className="font-semibold text-text">{formatCurrency(q.quotedAmount)}</span>
      ),
    },
    {
      header: 'Transit Days',
      accessor: (q) => <span className="text-text-muted">{q.transitDays} days</span>,
    },
    {
      header: 'Notes',
      accessor: (q) => <span className="type-caption max-w-xs truncate">{q.notes ?? '—'}</span>,
    },
    {
      header: 'Status',
      accessor: (q) => <Badge label={q.status} className={getQuoteStatusColor(q.status)} />,
    },
    {
      header: 'Updated',
      accessor: (q) => <span className="type-caption">{formatDate(q.updatedAt)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="type-page-title">Reports</h2>
          <p className="type-page-subtitle mt-1">
            Filtered reports for inquiries and vendor quotes
          </p>
        </div>
        <Button
          onClick={() => {
            handlePrint();
          }}
          variant="secondary"
        >
          <Printer size={16} />
          Print Report
        </Button>
      </div>

      <div className="flex gap-1 bg-surface-raised p-1 rounded-xl w-fit">
        {(['inquiry', 'vendor'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize cursor-pointer ${
              activeTab === tab
                ? 'bg-surface text-text shadow-sm'
                : 'text-text-muted hover:text-text'
            }`}
          >
            {tab === 'inquiry' ? 'Inquiry Report' : 'Vendor Quote Report'}
          </button>
        ))}
      </div>

      <div ref={printRef} className="space-y-4">
        <div className="print-only hidden">
          <h1 className="text-xl font-bold text-text mb-2">
            {activeTab === 'inquiry' ? 'Inquiry Report' : 'Vendor Quote Report'}
          </h1>
          <p className="text-sm text-text-muted">Generated on {new Date().toLocaleDateString()}</p>
        </div>

        {activeTab === 'inquiry' && (
          <>
            <div className="bg-surface rounded-2xl border border-border p-4 no-print">
              <div className="flex items-center gap-2 mb-3 text-sm font-medium text-text-muted">
                <Filter size={16} />
                Filters
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                <Input
                  label="Search"
                  placeholder="Customer or inquiry no..."
                  value={inqSearch}
                  onChange={(e) => {
                    setInqSearch(e.target.value);
                  }}
                />
                <AppSelect
                  label="Status"
                  value={inqStatus}
                  onChange={setInqStatus}
                  options={inqStatusOptions}
                  placeholder="All Statuses"
                  isClearable
                />
                <Input
                  label="From Date"
                  type="date"
                  value={inqDateFrom}
                  onChange={(e) => {
                    setInqDateFrom(e.target.value);
                  }}
                />
                <Input
                  label="To Date"
                  type="date"
                  value={inqDateTo}
                  onChange={(e) => {
                    setInqDateTo(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="bg-surface rounded-2xl border border-border overflow-hidden">
              <div className="px-6 py-3 border-b border-border text-sm text-text-muted">
                {filteredInquiries.length} records
              </div>
              <DataTable
                tableClassName="min-w-[640px]"
                data={filteredInquiries}
                columns={inqColumns}
                rowKey={(inq) => inq.id}
                pageSize={10000}
                emptyMessage="No inquiries match the filters"
              />
            </div>
          </>
        )}

        {activeTab === 'vendor' && (
          <>
            <div className="bg-surface rounded-2xl border border-border p-4 no-print">
              <div className="flex items-center gap-2 mb-3 text-sm font-medium text-text-muted">
                <Filter size={16} />
                Filters
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                <Input
                  label="Search"
                  placeholder="Search vendor name..."
                  value={vndSearch}
                  onChange={(e) => {
                    setVndSearch(e.target.value);
                  }}
                />
                <AppSelect
                  label="Status"
                  value={vndStatus}
                  onChange={setVndStatus}
                  options={vndStatusOptions}
                  placeholder="All Statuses"
                  isClearable
                />
              </div>
            </div>

            <div className="bg-surface rounded-2xl border border-border overflow-hidden">
              <div className="px-6 py-3 border-b border-border text-sm text-text-muted">
                {filteredQuotes.length} records
              </div>
              <DataTable
                tableClassName="min-w-[560px]"
                data={filteredQuotes}
                columns={vndColumns}
                rowKey={(q) => q.id}
                pageSize={10000}
                emptyMessage="No vendor quotes match the filters"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
