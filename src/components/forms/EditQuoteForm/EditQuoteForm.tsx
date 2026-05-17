import { useState, type FormEvent } from 'react';
import * as yup from 'yup';
import { toast } from 'sonner';
import { useAppDispatch } from '@/app/hooks';
import { updateActualQuote } from '@/features/vendors/vendorSlice';
import type { QuoteStatus } from '@/types';
import { QUOTE_STATUSES } from '@/utils/constants';
import { Input } from '@/components/ui/Input';
import { AppSelect } from '@/components/ui/AppSelect';
import { Button } from '@/components/ui/Button';
import type { EditQuoteFormProps } from './EditQuoteForm.types';

interface EditQuoteFormData {
  quotedAmount: number;
  transitDays: number;
  notes: string;
  status: QuoteStatus;
}

type EditQuoteFormErrors = Partial<Record<keyof EditQuoteFormData, string>>;

const schema = yup.object({
  quotedAmount: yup
    .number()
    .typeError('Quoted amount must be a number')
    .min(0, 'Amount cannot be negative')
    .required('Quoted amount is required'),
  transitDays: yup
    .number()
    .typeError('Transit days must be a number')
    .integer('Transit days must be a whole number')
    .min(0, 'Transit days cannot be negative')
    .required('Transit days is required'),
  notes: yup.string(),
  status: yup.string().oneOf(QUOTE_STATUSES, 'Invalid status').required('Status is required'),
});

export const EditQuoteForm = ({ quote, onSuccess, onCancel }: EditQuoteFormProps) => {
  const dispatch = useAppDispatch();

  const [form, setForm] = useState<EditQuoteFormData>({
    quotedAmount: quote.quotedAmount,
    transitDays: quote.transitDays,
    notes: quote.notes ?? '',
    status: quote.status,
  });
  const [errors, setErrors] = useState<EditQuoteFormErrors>({});

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    try {
      await schema.validate(form, { abortEarly: false });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const mapped: EditQuoteFormErrors = {};
        err.inner.forEach((e) => {
          if (e.path) mapped[e.path as keyof EditQuoteFormData] = e.message;
        });
        setErrors(mapped);
      }
      return;
    }
    try {
      await dispatch(updateActualQuote({ id: quote.id, ...form })).unwrap();
      toast.success('Quote updated successfully!');
      onSuccess();
    } catch {
      toast.error('Failed to update quote. Please try again.');
    }
  };

  const statusOptions = QUOTE_STATUSES.map((s) => ({ value: s, label: s }));

  return (
    <form
      onSubmit={(ev) => {
        void handleSubmit(ev);
      }}
      noValidate
      className="space-y-4"
    >
      <div className="bg-surface-raised border border-border-dark rounded-xl px-4 py-3">
        <p className="type-caption mb-0.5">Vendor</p>
        <p className="font-semibold text-text">{quote.vendorName}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Quoted Amount (₹)"
          type="number"
          min={0}
          value={form.quotedAmount}
          onChange={(e) => {
            setForm((p) => ({ ...p, quotedAmount: parseFloat(e.target.value) || 0 }));
          }}
          error={errors.quotedAmount}
          required
        />
        <Input
          label="Transit Days"
          type="number"
          min={0}
          value={form.transitDays}
          onChange={(e) => {
            setForm((p) => ({ ...p, transitDays: parseInt(e.target.value) || 0 }));
          }}
          error={errors.transitDays}
          required
        />
        <AppSelect
          label="Status"
          value={form.status}
          onChange={(v) => {
            setForm((p) => ({ ...p, status: v as QuoteStatus }));
          }}
          options={statusOptions}
          error={errors.status}
          isSearchable={false}
        />
        <Input
          label="Notes"
          placeholder="Optional notes"
          value={form.notes}
          onChange={(e) => {
            setForm((p) => ({ ...p, notes: e.target.value }));
          }}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
};
