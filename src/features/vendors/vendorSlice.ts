import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import type { VendorState, VendorQuoteRequest, ActualVendorQuote, QuoteStatus } from '@/types';
import * as vendorApi from '@/api/vendorApi';
import type { RootState } from '@/app/store';
import { logoutThunk } from '@/features/auth/authSlice';

export const loadVendorData = createAsyncThunk('vendors/load', async () => {
  const [quoteRequests, actualQuotes] = await Promise.all([
    vendorApi.fetchQuoteRequests(),
    vendorApi.fetchActualQuotes(),
  ]);
  return { quoteRequests, actualQuotes };
});

export const addQuoteRequests = createAsyncThunk(
  'vendors/addRequests',
  (data: Omit<VendorQuoteRequest, 'id' | 'createdAt'>[]) => vendorApi.createQuoteRequests(data),
);

export const addActualQuote = createAsyncThunk(
  'vendors/addQuote',
  (data: Omit<ActualVendorQuote, 'id' | 'updatedAt'>) => vendorApi.createActualQuote(data),
);

export const updateActualQuote = createAsyncThunk(
  'vendors/updateQuote',
  (data: Partial<ActualVendorQuote> & { id: string }) => vendorApi.updateActualQuote(data),
);

export const updateQuoteStatus = createAsyncThunk(
  'vendors/updateStatus',
  ({ id, status }: { id: string; status: QuoteStatus }) => vendorApi.updateQuoteStatus(id, status),
);

const initialState: VendorState = {
  quoteRequests: [],
  actualQuotes: [],
  loading: false,
  error: null,
};

const vendorSlice = createSlice({
  name: 'vendors',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadVendorData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadVendorData.fulfilled, (state, action) => {
        state.loading = false;
        state.quoteRequests = action.payload.quoteRequests;
        state.actualQuotes = action.payload.actualQuotes;
      })
      .addCase(loadVendorData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load vendor data';
      });

    builder
      .addCase(addQuoteRequests.fulfilled, (state, action) => {
        state.quoteRequests.push(...action.payload.requests);
        state.actualQuotes.push(...action.payload.quotes);
      })
      .addCase(addQuoteRequests.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to save quote requests';
      });

    builder
      .addCase(addActualQuote.fulfilled, (state, action) => {
        state.actualQuotes.push(action.payload);
      })
      .addCase(addActualQuote.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to add quote';
      });

    builder
      .addCase(updateActualQuote.fulfilled, (state, action) => {
        const idx = state.actualQuotes.findIndex((q) => q.id === action.payload.id);
        if (idx !== -1) state.actualQuotes[idx] = action.payload;
      })
      .addCase(updateActualQuote.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to update quote';
      });

    builder
      .addCase(updateQuoteStatus.fulfilled, (state, action) => {
        const idx = state.actualQuotes.findIndex((q) => q.id === action.payload.id);
        if (idx !== -1) state.actualQuotes[idx] = action.payload;
      })
      .addCase(updateQuoteStatus.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to update quote status';
      });

    builder.addCase(logoutThunk.fulfilled, () => ({ ...initialState }));
  },
});

export default vendorSlice.reducer;

export const selectQuoteRequests = (state: RootState) => state.vendors.quoteRequests;
export const selectActualQuotes = (state: RootState) => state.vendors.actualQuotes;
export const selectVendorsLoading = (state: RootState) => state.vendors.loading;

export const selectPendingQuotesCount = createSelector(
  selectActualQuotes,
  (quotes) => quotes.filter((q) => q.status === 'Pending' || q.status === 'Quoted').length,
);

export const selectApprovedQuotesCount = createSelector(
  selectActualQuotes,
  (quotes) => quotes.filter((q) => q.status === 'Approved').length,
);

export const selectVendorsCount = createSelector(selectQuoteRequests, (requests) => {
  const uniqueVendors = new Set(requests.map((r) => r.vendorName));
  return uniqueVendors.size;
});
