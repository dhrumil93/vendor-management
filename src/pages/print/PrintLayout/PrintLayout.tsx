import { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { Printer, ArrowLeft } from 'lucide-react';
import { useAppSelector } from '@/app/hooks';
import {
  formatDate,
  formatCurrency,
  getInquiryStatusColor,
  getQuoteStatusColor,
} from '@/utils/helpers';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const PrintLayout = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);

  const inquiries = useAppSelector((state) => state.inquiries.inquiries);
  const actualQuotes = useAppSelector((state) => state.vendors.actualQuotes);

  const handlePrint = useReactToPrint({ contentRef: printRef });

  const inquiry = type === 'inquiry' ? inquiries.find((i) => i.id === id) : null;
  const quotes =
    type === 'vendor'
      ? actualQuotes.filter((q) => q.requestId === id || q.inquiryId === id)
      : actualQuotes.filter((q) => q.inquiryId === inquiry?.id);

  return (
    <div className="bg-bg p-3 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6 no-print">
        <Button
          variant="ghost"
          onClick={() => {
            void navigate(-1);
          }}
        >
          <ArrowLeft size={16} />
          Back
        </Button>
        <Button
          onClick={() => {
            handlePrint();
          }}
        >
          <Printer size={16} />
          Print
        </Button>
      </div>

      <div
        ref={printRef}
        className="bg-surface rounded-2xl shadow-sm border border-border max-w-4xl mx-auto p-4 sm:p-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border-dark pb-4 sm:pb-6 mb-4 sm:mb-6">
          <div>
            <h1 className="type-page-title">LogiTrack</h1>
            <p className="type-body mt-0.5">Logistics Inquiry &amp; Vendor Quote System</p>
          </div>
          <div className="text-right shrink-0">
            <p className="type-caption">Printed on</p>
            <p className="type-label mt-0.5">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {inquiry && (
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4">
              <h2 className="type-section-title">Inquiry Details</h2>
              <Badge label={inquiry.status} className={getInquiryStatusColor(inquiry.status)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { label: 'Inquiry No', value: inquiry.inquiryNo },
                { label: 'Date', value: formatDate(inquiry.date) },
                { label: 'Customer', value: inquiry.customerName },
                { label: 'From', value: inquiry.fromLocation },
                { label: 'To', value: inquiry.toLocation },
                { label: 'Vehicle Type', value: inquiry.vehicleType },
                { label: 'Material', value: inquiry.materialType },
                { label: 'Weight', value: `${inquiry.weight.toLocaleString()} kg` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-bg rounded-lg p-3 min-w-0">
                  <p className="type-caption mb-1">{label}</p>
                  <p className="type-label break-words">{value}</p>
                </div>
              ))}
            </div>
            {inquiry.notes && (
              <div className="mt-3 bg-warning-light border border-yellow-100 rounded-lg p-3">
                <p className="type-caption font-medium text-warning mb-1">Notes</p>
                <p className="type-body text-text">{inquiry.notes}</p>
              </div>
            )}
          </div>
        )}

        {quotes.length > 0 && (
          <div>
            <h2 className="type-section-title mb-3 sm:mb-4">Vendor Quotes</h2>
            <div className="overflow-x-auto rounded-xl border border-border-dark">
              <table className="w-full text-sm min-w-[480px]">
                <thead>
                  <tr className="bg-bg">
                    {['Vendor', 'Quoted Amount', 'Transit Days', 'Notes', 'Status'].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left type-table-header whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {quotes.map((q) => (
                    <tr key={q.id}>
                      <td className="px-4 py-3 type-label whitespace-nowrap">{q.vendorName}</td>
                      <td className="px-4 py-3 type-label font-semibold whitespace-nowrap">
                        {formatCurrency(q.quotedAmount)}
                      </td>
                      <td className="px-4 py-3 type-body text-text whitespace-nowrap">
                        {q.transitDays} days
                      </td>
                      <td className="px-4 py-3 type-caption max-w-[180px]">{q.notes ?? '—'}</td>
                      <td className="px-4 py-3">
                        <Badge label={q.status} className={getQuoteStatusColor(q.status)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-border-dark text-center">
          <p className="type-caption">
            This document was generated by LogiTrack — Logistics Inquiry &amp; Vendor Quote System
          </p>
        </div>
      </div>
    </div>
  );
};
