import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import type { InquiryState, InquiryFormData, InquiryStatus } from '@/types';
import * as inquiryApi from '@/api/inquiryApi';
import type { RootState } from '@/app/store';
import { logoutThunk } from '@/features/auth/authSlice';
import { generateInquiryNo } from '@/utils/helpers';

export const loadInquiries = createAsyncThunk('inquiries/load', () => inquiryApi.fetchInquiries());

export const createInquiry = createAsyncThunk(
  'inquiries/create',
  (data: InquiryFormData, { getState }) => {
    const state = getState() as RootState;
    const inquiryNo = generateInquiryNo(state.inquiries.inquiries);
    return inquiryApi.createInquiry({
      ...data,
      inquiryNo,
      createdAt: new Date().toISOString(),
    });
  },
);

export const changeInquiryStatus = createAsyncThunk(
  'inquiries/updateStatus',
  ({ id, status }: { id: string; status: InquiryStatus }) =>
    inquiryApi.updateInquiryStatus(id, status),
);

export const editInquiry = createAsyncThunk(
  'inquiries/update',
  (data: Partial<InquiryFormData> & { id: string }) => inquiryApi.updateInquiry(data),
);

export const removeInquiry = createAsyncThunk('inquiries/delete', (id: string) =>
  inquiryApi.deleteInquiry(id).then(() => id),
);

const initialState: InquiryState = {
  inquiries: [],
  loading: false,
  error: null,
};

const inquirySlice = createSlice({
  name: 'inquiries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadInquiries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadInquiries.fulfilled, (state, action) => {
        state.loading = false;
        state.inquiries = action.payload;
      })
      .addCase(loadInquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load inquiries';
      });

    builder
      .addCase(createInquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.inquiries.push(action.payload);
      })
      .addCase(createInquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to create inquiry';
      });

    builder
      .addCase(changeInquiryStatus.fulfilled, (state, action) => {
        const idx = state.inquiries.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.inquiries[idx] = action.payload;
      })
      .addCase(changeInquiryStatus.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to update inquiry status';
      });

    builder
      .addCase(editInquiry.fulfilled, (state, action) => {
        const idx = state.inquiries.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.inquiries[idx] = action.payload;
      })
      .addCase(editInquiry.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to update inquiry';
      });

    builder
      .addCase(removeInquiry.fulfilled, (state, action) => {
        state.inquiries = state.inquiries.filter((i) => i.id !== action.payload);
      })
      .addCase(removeInquiry.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to delete inquiry';
      });

    builder.addCase(logoutThunk.fulfilled, () => ({ ...initialState }));
  },
});

export default inquirySlice.reducer;

export const selectInquiries = (state: RootState) => state.inquiries.inquiries;
export const selectInquiriesLoading = (state: RootState) => state.inquiries.loading;
export const selectTotalInquiries = (state: RootState) => state.inquiries.inquiries.length;

export const selectInquiriesByStatus = createSelector(
  [selectInquiries, (_: RootState, status: InquiryStatus) => status],
  (inquiries, status) => inquiries.filter((i) => i.status === status),
);

export const selectRecentInquiries = createSelector([selectInquiries], (inquiries) =>
  [...inquiries]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5),
);

export {
  createInquiry as addInquiry,
  editInquiry as updateInquiry,
  changeInquiryStatus as updateInquiryStatus,
  removeInquiry as deleteInquiry,
};
