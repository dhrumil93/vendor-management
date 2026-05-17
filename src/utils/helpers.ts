import type { Inquiry, InquiryStatus, QuoteStatus } from '@/types';
import { DATE_LOCALE, CURRENCY_LOCALE, CURRENCY_CODE } from '@/utils/constants';

export const generateInquiryNo = (existingInquiries: Inquiry[]): string => {
  const max =
    existingInquiries.length === 0
      ? 0
      : Math.max(...existingInquiries.map((i) => parseInt(i.inquiryNo.replace('INQ-', ''), 10)));
  return `INQ-${String(max + 1).padStart(3, '0')}`;
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`);
  return date.toLocaleDateString(DATE_LOCALE, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat(CURRENCY_LOCALE, {
    style: 'currency',
    currency: CURRENCY_CODE,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getInquiryStatusColor = (status: InquiryStatus): string => {
  const map: Record<InquiryStatus, string> = {
    Pending: 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    Approved: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
  };
  return map[status];
};

export const getQuoteStatusColor = (status: QuoteStatus): string => {
  const map: Record<QuoteStatus, string> = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Quoted: 'bg-blue-100 text-blue-800',
    Approved: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
  };
  return map[status];
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

export const getTodayISO = (): string => {
  return new Date().toISOString().split('T')[0] ?? new Date().toISOString();
};
