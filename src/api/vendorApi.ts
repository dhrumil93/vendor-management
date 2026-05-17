import { apiGet, apiPost, apiPatch } from './client';
import { mockQuoteRequests, mockActualQuotes } from '@/data/mockVendors';
import { generateId } from '@/utils/helpers';
import type { VendorQuoteRequest, ActualVendorQuote, QuoteStatus } from '@/types';

const _requests: VendorQuoteRequest[] = [...mockQuoteRequests];
const _quotes: ActualVendorQuote[] = [...mockActualQuotes];

export const fetchQuoteRequests = (): Promise<VendorQuoteRequest[]> =>
  apiGet('/vendor/requests', () => [..._requests]);

export const fetchActualQuotes = (): Promise<ActualVendorQuote[]> =>
  apiGet('/vendor/quotes', () => [..._quotes]);

export interface CreateQuoteRequestsResult {
  requests: VendorQuoteRequest[];
  quotes: ActualVendorQuote[];
}

export const createQuoteRequests = (
  data: Omit<VendorQuoteRequest, 'id' | 'createdAt'>[],
): Promise<CreateQuoteRequestsResult> =>
  apiPost('/vendor/requests', data, () => {
    const now = new Date().toISOString();
    const requests: VendorQuoteRequest[] = [];
    const quotes: ActualVendorQuote[] = [];

    for (const req of data) {
      const requestId = generateId();
      const request: VendorQuoteRequest = {
        ...req,
        id: requestId,
        createdAt: now,
      };
      requests.push(request);

      const quote: ActualVendorQuote = {
        id: generateId(),
        requestId,
        inquiryId: req.inquiryId,
        vendorName: req.vendorName,
        quotedAmount: req.expectedRate,
        transitDays: 0,
        notes: req.remarks,
        status: 'Pending',
        updatedAt: now,
      };
      quotes.push(quote);
    }

    _requests.push(...requests);
    _quotes.push(...quotes);
    return {
      requests: requests.map((r) => ({ ...r })),
      quotes: quotes.map((q) => ({ ...q })),
    };
  });

export const createActualQuote = (
  data: Omit<ActualVendorQuote, 'id' | 'updatedAt'>,
): Promise<ActualVendorQuote> =>
  apiPost('/vendor/quotes', data, () => {
    const quote: ActualVendorQuote = {
      ...data,
      id: generateId(),
      updatedAt: new Date().toISOString(),
    };
    _quotes.push(quote);
    return { ...quote };
  });

export const updateActualQuote = (
  data: Partial<ActualVendorQuote> & { id: string },
): Promise<ActualVendorQuote> =>
  apiPatch(`/vendor/quotes/${data.id}`, data, () => {
    const idx = _quotes.findIndex((q) => q.id === data.id);
    if (idx === -1) throw new Error('Quote not found');
    const updatedItem = { ..._quotes[idx], ...data, updatedAt: new Date().toISOString() };
    _quotes[idx] = updatedItem;
    return { ...updatedItem };
  });

export const updateQuoteStatus = (id: string, status: QuoteStatus): Promise<ActualVendorQuote> =>
  apiPatch(`/vendor/quotes/${id}/status`, { status }, () => {
    const idx = _quotes.findIndex((q) => q.id === id);
    if (idx === -1) throw new Error('Quote not found');
    const updatedItem = { ..._quotes[idx], status, updatedAt: new Date().toISOString() };
    _quotes[idx] = updatedItem;
    return { ...updatedItem };
  });
