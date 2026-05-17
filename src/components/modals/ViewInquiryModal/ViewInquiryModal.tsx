import { useNavigate } from 'react-router-dom';
import { Printer } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, getInquiryStatusColor } from '@/utils/helpers';
import { printPath } from '@/utils/routes';
import type { ViewInquiryModalProps } from './ViewInquiryModal.types';

export const ViewInquiryModal = ({ isOpen, onClose, inquiry }: ViewInquiryModalProps) => {
  const navigate = useNavigate();

  if (!inquiry) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Inquiry Details - ${inquiry.inquiryNo}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => {
              void navigate(printPath('inquiry', inquiry.id));
            }}
          >
            <Printer size={16} />
            Print
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="block type-caption mb-1">Customer</span>
            <span className="type-body font-medium text-text">{inquiry.customerName}</span>
          </div>
          <div>
            <span className="block type-caption mb-1">Status</span>
            <Badge label={inquiry.status} className={getInquiryStatusColor(inquiry.status)} />
          </div>
          <div>
            <span className="block type-caption mb-1">Date</span>
            <span className="type-body">{formatDate(inquiry.date)}</span>
          </div>
          <div>
            <span className="block type-caption mb-1">Created At</span>
            <span className="type-body">{formatDate(inquiry.createdAt)}</span>
          </div>
        </div>

        <div className="bg-surface-raised border border-border rounded-xl p-4">
          <h4 className="type-section-title mb-3 text-text-muted">Logistics Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="block type-caption mb-1">From Location</span>
              <span className="type-body text-primary-text">{inquiry.fromLocation}</span>
            </div>
            <div>
              <span className="block type-caption mb-1">To Location</span>
              <span className="type-body text-primary-text">{inquiry.toLocation}</span>
            </div>
            <div>
              <span className="block type-caption mb-1">Vehicle Type</span>
              <span className="type-body text-primary-text">{inquiry.vehicleType}</span>
            </div>
            <div>
              <span className="block type-caption mb-1">Material Type</span>
              <span className="type-body text-primary-text">{inquiry.materialType}</span>
            </div>
            <div>
              <span className="block type-caption mb-1">Weight (kg)</span>
              <span className="type-body text-primary-text">{inquiry.weight.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {inquiry.notes && (
          <div>
            <span className="block type-caption mb-1">Notes</span>
            <p className="type-body bg-surface-raised p-3 rounded-lg border border-border text-text-muted">
              {inquiry.notes}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
