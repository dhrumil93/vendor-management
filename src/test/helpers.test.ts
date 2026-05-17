import { describe, it, expect } from 'vitest';
import {
  generateInquiryNo,
  formatDate,
  formatCurrency,
  getInquiryStatusColor,
  getQuoteStatusColor,
  generateId,
  getTodayISO,
} from '@/utils/helpers';
import type { Inquiry, InquiryStatus, QuoteStatus } from '@/types';

const makeInquiry = (inquiryNo: string): Inquiry =>
  ({
    id: inquiryNo,
    inquiryNo,
    date: '2024-01-01',
    customerName: 'Test',
    fromLocation: 'A',
    toLocation: 'B',
    vehicleType: 'Truck',
    materialType: 'Electronics',
    weight: 100,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  }) as Inquiry;

describe('generateInquiryNo', () => {
  it('returns INQ-001 when there are no existing inquiries', () => {
    expect(generateInquiryNo([])).toBe('INQ-001');
  });

  it('returns the next sequential number', () => {
    const existing = [makeInquiry('INQ-001'), makeInquiry('INQ-002')];
    expect(generateInquiryNo(existing)).toBe('INQ-003');
  });

  it('does not duplicate after a deletion (uses max, not length)', () => {
    const existing = [makeInquiry('INQ-001'), makeInquiry('INQ-003')];
    expect(generateInquiryNo(existing)).toBe('INQ-004');
  });

  it('zero-pads to three digits', () => {
    const existing = Array.from({ length: 9 }, (_, i) => makeInquiry(`INQ-00${String(i + 1)}`));
    expect(generateInquiryNo(existing)).toBe('INQ-010');
  });

  it('handles a single existing inquiry', () => {
    expect(generateInquiryNo([makeInquiry('INQ-005')])).toBe('INQ-006');
  });
});

describe('formatDate', () => {
  it('formats a plain ISO date string correctly (en-IN locale)', () => {
    expect(formatDate('2024-05-01')).toBe('01/05/2024');
  });

  it('formats an ISO timestamp without shifting the date', () => {
    expect(formatDate('2024-05-15T10:30:00.000Z')).toBe('15/05/2024');
  });

  it('formats a different date correctly', () => {
    expect(formatDate('2023-12-25')).toBe('25/12/2023');
  });

  it('formats end-of-month dates correctly', () => {
    expect(formatDate('2024-03-31')).toBe('31/03/2024');
  });
});

describe('formatCurrency', () => {
  it('formats a positive integer amount in INR', () => {
    const result = formatCurrency(50000);
    expect(result).toContain('50,000');
    expect(result).toMatch(/₹|INR/);
  });

  it('formats zero and still includes the currency symbol', () => {
    const result = formatCurrency(0);
    expect(result).toMatch(/₹|INR/);
    expect(result).toContain('0');
  });

  it('produces no decimal places (maximumFractionDigits: 0)', () => {
    expect(formatCurrency(1234.99)).not.toContain('.');
  });

  it('formats large amounts in en-IN lakh style', () => {
    // en-IN formats 100000 as ₹1,00,000
    expect(formatCurrency(100000)).toContain('1,00,000');
  });

  it('formats negative amounts with the currency symbol', () => {
    const result = formatCurrency(-5000);
    expect(result).toMatch(/₹|INR/);
    expect(result).toContain('5,000');
  });
});

describe('getInquiryStatusColor', () => {
  const cases: [InquiryStatus, string, string][] = [
    ['Pending', 'bg-yellow-100', 'text-yellow-800'],
    ['In Progress', 'bg-blue-100', 'text-blue-800'],
    ['Approved', 'bg-green-100', 'text-green-800'],
    ['Rejected', 'bg-red-100', 'text-red-800'],
  ];

  it.each(cases)('returns correct classes for "%s"', (status, bg, text) => {
    const result = getInquiryStatusColor(status);
    expect(result).toContain(bg);
    expect(result).toContain(text);
  });
});

describe('getQuoteStatusColor', () => {
  const cases: [QuoteStatus, string, string][] = [
    ['Pending', 'bg-yellow-100', 'text-yellow-800'],
    ['Quoted', 'bg-blue-100', 'text-blue-800'],
    ['Approved', 'bg-green-100', 'text-green-800'],
    ['Rejected', 'bg-red-100', 'text-red-800'],
  ];

  it.each(cases)('returns correct classes for "%s"', (status, bg, text) => {
    const result = getQuoteStatusColor(status);
    expect(result).toContain(bg);
    expect(result).toContain(text);
  });
});

describe('generateId', () => {
  it('returns a non-empty string', () => {
    expect(typeof generateId()).toBe('string');
    expect(generateId().length).toBeGreaterThan(0);
  });

  it('matches the expected format (timestamp-randomchars)', () => {
    expect(generateId()).toMatch(/^\d+-[a-z0-9]+$/);
  });

  it('returns unique values across repeated calls', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

describe('getTodayISO', () => {
  it('returns a string in YYYY-MM-DD format', () => {
    expect(getTodayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("matches today's UTC date", () => {
    const today = new Date().toISOString().split('T')[0];
    expect(getTodayISO()).toBe(today);
  });
});
