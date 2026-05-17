import { apiGet, apiPost, apiPatch, apiDelete } from './client';
import { mockInquiries } from '@/data/mockInquiries';
import { generateId } from '@/utils/helpers';
import type { Inquiry, InquiryStatus } from '@/types';

let _store: Inquiry[] = [...mockInquiries];

export const fetchInquiries = (): Promise<Inquiry[]> => apiGet('/inquiries', () => [..._store]);

export const createInquiry = (data: Omit<Inquiry, 'id'>): Promise<Inquiry> =>
  apiPost('/inquiries', data, () => {
    const inquiry: Inquiry = { ...data, id: generateId() };
    _store.push(inquiry);
    return { ...inquiry };
  });

export const updateInquiryStatus = (id: string, status: InquiryStatus): Promise<Inquiry> =>
  apiPatch(`/inquiries/${id}/status`, { status }, () => {
    const idx = _store.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error('Inquiry not found');
    _store[idx] = { ..._store[idx], status };
    return { ..._store[idx] };
  });

export const updateInquiry = (data: Partial<Inquiry> & { id: string }): Promise<Inquiry> =>
  apiPatch(`/inquiries/${data.id}`, data, () => {
    const idx = _store.findIndex((i) => i.id === data.id);
    if (idx === -1) throw new Error('Inquiry not found');
    _store[idx] = { ..._store[idx], ...data };
    return { ..._store[idx] };
  });

export const deleteInquiry = (id: string): Promise<void> =>
  apiDelete(`/inquiries/${id}`, () => {
    _store = _store.filter((i) => i.id !== id);
  });
