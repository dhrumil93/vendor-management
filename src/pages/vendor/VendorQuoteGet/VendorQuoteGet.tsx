import { useState, useEffect, type FormEvent } from 'react';
import { Plus, Trash2, Send, Package } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { addQuoteRequests } from '@/features/vendors/vendorSlice';
import { loadInquiries } from '@/features/inquiries/inquirySlice';
import { ListPageSkeleton } from '@/components/ui/Skeleton';
import { formatCurrency } from '@/utils/helpers';
import { AppSelect } from '@/components/ui/AppSelect';
import { Button } from '@/components/ui/Button';
import { AddVendorModal } from '@/components/modals';
import type { VendorEntry } from '@/components/forms';

export const VendorQuoteGet = () => {
  const dispatch = useAppDispatch();
  const inquiries = useAppSelector((state) => state.inquiries.inquiries);
  const loading = useAppSelector((state) => state.inquiries.loading);

  useEffect(() => {
    void dispatch(loadInquiries());
  }, [dispatch]);

  const [selectedInquiryId, setSelectedInquiryId] = useState('');
  const [vendors, setVendors] = useState<VendorEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedInquiry = inquiries.find((i) => i.id === selectedInquiryId);

  const handleAddVendor = (entry: VendorEntry) => {
    setVendors((prev) => [...prev, entry]);
  };

  const removeVendor = (idx: number) => {
    setVendors((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedInquiryId) {
      toast.error('Please select an inquiry');
      return;
    }
    if (vendors.length === 0) {
      toast.error('Add at least one vendor before sending');
      return;
    }
    if (!selectedInquiry) return;

    try {
      await dispatch(
        addQuoteRequests(
          vendors.map((v) => ({
            inquiryId: selectedInquiry.id,
            inquiryNo: selectedInquiry.inquiryNo,
            vendorName: v.vendorName,
            expectedRate: v.expectedRate,
            remarks: v.remarks || undefined,
          })),
        ),
      ).unwrap();

      const count = vendors.length;
      toast.success(`Quote requests sent to ${count} vendor${count > 1 ? 's' : ''}!`);
      setSelectedInquiryId('');
      setVendors([]);
    } catch {
      toast.error('Failed to send quote requests. Please try again.');
    }
  };

  const inquiryOptions = inquiries.map((i) => ({
    value: i.id,
    label: `${i.inquiryNo} — ${i.customerName} (${i.fromLocation} → ${i.toLocation})`,
  }));

  if (loading) return <ListPageSkeleton cols={3} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="type-page-title">Get Vendor Quotes</h2>
        <p className="type-page-subtitle mt-1">
          Send quote requests to multiple vendors for an inquiry
        </p>
      </div>

      <div className="bg-surface rounded-2xl border border-border p-6 space-y-6">
        <form
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          noValidate
          className="space-y-6"
        >
          <div className="max-w-lg">
            <AppSelect
              label="Select Inquiry"
              value={selectedInquiryId}
              onChange={setSelectedInquiryId}
              options={inquiryOptions}
              placeholder="Choose an inquiry..."
              isClearable
              required
            />
          </div>

          {selectedInquiry && (
            <div className="bg-primary-light rounded-xl p-4 text-sm grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <p className="type-caption">Vehicle Type</p>
                <p className="font-medium text-text">{selectedInquiry.vehicleType}</p>
              </div>
              <div>
                <p className="type-caption">Material</p>
                <p className="font-medium text-text">{selectedInquiry.materialType}</p>
              </div>
              <div>
                <p className="type-caption">Weight</p>
                <p className="font-medium text-text">
                  {selectedInquiry.weight.toLocaleString()} kg
                </p>
              </div>
              <div>
                <p className="type-caption">Status</p>
                <p className="font-medium text-text">{selectedInquiry.status}</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="type-section-title">Vendor Quote Requests</h3>
                {vendors.length > 0 && (
                  <p className="type-caption mt-0.5">
                    {vendors.length} vendor{vendors.length > 1 ? 's' : ''} added
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                <Plus size={14} />
                Add Vendor
              </Button>
            </div>

            {vendors.length === 0 ? (
              <div
                className="border-2 border-dashed border-border-dark rounded-xl py-12 text-center cursor-pointer hover:border-primary hover:bg-primary-lighter transition-colors"
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                <Package size={36} className="mx-auto mb-3 text-text-faint" />
                <p className="text-text-muted text-sm font-medium">No vendors added yet</p>
                <p className="text-text-faint text-xs mt-1">
                  Click &ldquo;Add Vendor&rdquo; or tap here to get started
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="hidden sm:grid grid-cols-10 gap-3 type-table-header bg-surface-raised px-4 py-2.5">
                  <div className="col-span-3">Vendor Name</div>
                  <div className="col-span-3">Expected Rate</div>
                  <div className="col-span-3">Remarks</div>
                  <div className="col-span-1" />
                </div>

                <div className="divide-y divide-border">
                  {vendors.map((v, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 sm:grid-cols-10 gap-2 sm:gap-3 items-center px-4 py-3 hover:bg-surface-raised transition-colors"
                    >
                      <div className="sm:col-span-3 font-medium text-text text-sm">
                        {v.vendorName}
                      </div>
                      <div className="sm:col-span-3 text-sm font-semibold text-text">
                        {formatCurrency(v.expectedRate)}
                      </div>
                      <div className="sm:col-span-3 text-sm text-text-faint truncate">
                        {v.remarks || '—'}
                      </div>
                      <div className="sm:col-span-1 flex justify-end">
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            removeVendor(idx);
                          }}
                          title="Remove vendor"
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={vendors.length === 0}>
              <Send size={15} />
              Send Quote Requests
              {vendors.length > 0 && (
                <span className="ml-1 bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {vendors.length}
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>

      <AddVendorModal
        key={vendors.length}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        onAdd={handleAddVendor}
      />
    </div>
  );
};
