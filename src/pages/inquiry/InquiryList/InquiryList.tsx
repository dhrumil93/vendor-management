import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Pencil, Trash2, Printer } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { loadInquiries, deleteInquiry } from '@/features/inquiries/inquirySlice';
import { ListPageSkeleton } from '@/components/ui/Skeleton';
import { INQUIRY_STATUSES, PAGE_SIZE } from '@/utils/constants';
import { getInquiryStatusColor, formatDate } from '@/utils/helpers';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AppSelect } from '@/components/ui/AppSelect';
import { Modal } from '@/components/ui/Modal';
import { DataTable } from '@/components/ui/DataTable';
import { CreateInquiryModal, ViewInquiryModal, EditInquiryModal } from '@/components/modals';
import { usePermission } from '@/hooks/usePermission';
import { printPath } from '@/utils/routes';

export const InquiryList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const inquiries = useAppSelector((state) => state.inquiries.inquiries);
  const loading = useAppSelector((state) => state.inquiries.loading);

  useEffect(() => {
    void dispatch(loadInquiries());
  }, [dispatch]);

  const canAdd = usePermission('add');
  const canEdit = usePermission('edit');
  const canDelete = usePermission('delete');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewInquiry, setViewInquiry] = useState<(typeof inquiries)[0] | null>(null);
  const [editInquiry, setEditInquiry] = useState<(typeof inquiries)[0] | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchSearch =
        !search ||
        inq.customerName.toLowerCase().includes(search.toLowerCase()) ||
        inq.inquiryNo.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || inq.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [inquiries, search, statusFilter]);

  const handleDelete = () => {
    if (deleteId) {
      dispatch(deleteInquiry(deleteId));
      setDeleteId(null);
    }
  };

  const statusOptions = [...INQUIRY_STATUSES.map((s) => ({ value: s, label: s }))];

  if (loading) return <ListPageSkeleton cols={8} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="type-page-title">Inquiry List</h2>
          <p className="type-page-subtitle mt-1">{filtered.length} inquiries found</p>
        </div>
        {canAdd && (
          <Button
            onClick={() => {
              setCreateOpen(true);
            }}
          >
            <Plus size={16} />
            Create New Inquiry
          </Button>
        )}
      </div>

      <div className="bg-surface rounded-2xl border border-border p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Search by customer or inquiry no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={16} />}
            wrapperClassName="flex-1"
          />
          <AppSelect
            value={statusFilter}
            onChange={(v) => setStatusFilter(v)}
            options={statusOptions}
            placeholder="All Statuses"
            isClearable
            wrapperClassName="sm:w-52"
          />
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <DataTable
          tableClassName="min-w-[720px]"
          data={filtered}
          columns={[
            {
              header: 'Inquiry No',
              accessor: (inq) => <span className="font-medium text-primary">{inq.inquiryNo}</span>,
            },
            {
              header: 'Date',
              accessor: (inq) => (
                <span className="text-text-muted whitespace-nowrap">{formatDate(inq.date)}</span>
              ),
            },
            {
              header: 'Customer',
              accessor: 'customerName',
              className: 'text-text font-medium',
            },
            {
              header: 'Route',
              accessor: (inq) => (
                <span className="text-text-muted whitespace-nowrap">
                  {inq.fromLocation} &rarr; {inq.toLocation}
                </span>
              ),
            },
            {
              header: 'Vehicle Type',
              accessor: (inq) => <span className="text-text-muted">{inq.vehicleType}</span>,
            },
            {
              header: 'Weight (kg)',
              accessor: (inq) => (
                <span className="text-text-muted">{inq.weight.toLocaleString()}</span>
              ),
            },
            {
              header: 'Status',
              accessor: (inq) => (
                <Badge label={inq.status} className={getInquiryStatusColor(inq.status)} />
              ),
            },
            {
              header: 'Actions',
              accessor: (inq) => (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    title="View Inquiry"
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewInquiry(inq);
                    }}
                  >
                    <Eye size={14} />
                  </Button>
                  {canEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Edit Inquiry"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditInquiry(inq);
                      }}
                    >
                      <Pencil size={14} />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Print Inquiry"
                    onClick={(e) => {
                      e.stopPropagation();
                      void navigate(printPath('inquiry', inq.id));
                    }}
                  >
                    <Printer size={14} />
                  </Button>
                  {canDelete && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(inq.id);
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              ),
            },
          ]}
          rowKey={(inq) => inq.id}
          pageSize={PAGE_SIZE}
          onRowClick={(inq) => setViewInquiry(inq)}
          emptyMessage="No inquiries found"
        />
      </div>

      <CreateInquiryModal
        isOpen={createOpen}
        onClose={() => {
          setCreateOpen(false);
        }}
      />

      <Modal
        isOpen={deleteId !== null}
        onClose={() => {
          setDeleteId(null);
        }}
        title="Confirm Delete"
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setDeleteId(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="type-body">
          Are you sure you want to delete this inquiry? This action cannot be undone.
        </p>
      </Modal>
      <ViewInquiryModal
        isOpen={viewInquiry !== null}
        onClose={() => setViewInquiry(null)}
        inquiry={viewInquiry}
      />
      <EditInquiryModal
        isOpen={editInquiry !== null}
        onClose={() => setEditInquiry(null)}
        inquiry={editInquiry}
      />
    </div>
  );
};
