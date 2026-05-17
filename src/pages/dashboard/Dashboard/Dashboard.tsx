import { useEffect } from 'react';
import { ClipboardList, Clock, CheckCircle, Users } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  loadInquiries,
  selectTotalInquiries,
  selectRecentInquiries,
} from '@/features/inquiries/inquirySlice';
import {
  loadVendorData,
  selectPendingQuotesCount,
  selectApprovedQuotesCount,
  selectVendorsCount,
} from '@/features/vendors/vendorSlice';
import { DataCard } from '@/components/ui/DataCard';
import { Badge } from '@/components/ui/Badge';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import { getInquiryStatusColor, formatDate } from '@/utils/helpers';
import { DataTable } from '@/components/ui/DataTable';

export const Dashboard = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(loadInquiries());
    void dispatch(loadVendorData());
  }, [dispatch]);

  const loading = useAppSelector((state) => state.inquiries.loading || state.vendors.loading);
  const user = useAppSelector((state) => state.auth.user);
  const totalInquiries = useAppSelector(selectTotalInquiries);
  const pendingQuotes = useAppSelector(selectPendingQuotesCount);
  const approvedQuotes = useAppSelector(selectApprovedQuotesCount);
  const vendorsCount = useAppSelector(selectVendorsCount);

  const recentInquiries = useAppSelector(selectRecentInquiries);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-text-muted">Welcome back,</p>
          <h2 className="text-xl font-bold text-text mt-0.5">{user?.name}</h2>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary-light text-primary-text border border-primary/20">
          {user?.role} &middot; {user?.branch} Branch
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <DataCard
          title="Total Inquiries"
          value={totalInquiries}
          icon={<ClipboardList size={22} />}
          color="blue"
          subtitle="All time"
        />
        <DataCard
          title="Pending Quotes"
          value={pendingQuotes}
          icon={<Clock size={22} />}
          color="yellow"
          subtitle="Awaiting response"
        />
        <DataCard
          title="Approved Quotes"
          value={approvedQuotes}
          icon={<CheckCircle size={22} />}
          color="green"
          subtitle="Successfully approved"
        />
        <DataCard
          title="Vendors Count"
          value={vendorsCount}
          icon={<Users size={22} />}
          color="purple"
          subtitle="Unique vendors"
        />
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="type-section-title">Recent Inquiries</h3>
        </div>
        <DataTable
          data={recentInquiries}
          columns={[
            {
              header: 'Inquiry No',
              accessor: (row) => <span className="font-medium text-primary">{row.inquiryNo}</span>,
            },
            {
              header: 'Customer',
              accessor: 'customerName',
            },
            {
              header: 'Route',
              accessor: (row) => (
                <span className="text-text-muted">
                  {row.fromLocation} &rarr; {row.toLocation}
                </span>
              ),
            },
            {
              header: 'Date',
              accessor: (row) => <span className="text-text-muted">{formatDate(row.date)}</span>,
            },
            {
              header: 'Status',
              accessor: (row) => (
                <Badge label={row.status} className={getInquiryStatusColor(row.status)} />
              ),
            },
          ]}
          rowKey={(row) => row.id}
          pageSize={5}
          tableClassName="min-w-[800px] whitespace-nowrap"
        />
      </div>
    </div>
  );
};
