import { useState, type FormEvent } from 'react';
import * as yup from 'yup';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { AddVendorFormProps } from './AddVendorForm.types';

interface AddVendorFormData {
  vendorName: string;
  expectedRate: string;
  remarks: string;
}

type FormErrors = Partial<Record<keyof AddVendorFormData, string>>;

const schema = yup.object({
  vendorName: yup.string().required('Vendor name is required'),
  expectedRate: yup
    .number()
    .typeError('Expected rate must be a number')
    .min(1, 'Must be greater than 0')
    .required('Expected rate is required'),
  remarks: yup.string(),
});

const emptyForm: AddVendorFormData = { vendorName: '', expectedRate: '', remarks: '' };

export const AddVendorForm = ({ onSuccess, onCancel }: AddVendorFormProps) => {
  const [form, setForm] = useState<AddVendorFormData>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await schema.validate(form, { abortEarly: false });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const mapped: FormErrors = {};
        err.inner.forEach((ve) => {
          if (ve.path) mapped[ve.path as keyof AddVendorFormData] = ve.message;
        });
        setErrors(mapped);
      }
      return;
    }
    onSuccess({
      vendorName: form.vendorName.trim(),
      expectedRate: parseFloat(form.expectedRate),
      remarks: form.remarks.trim(),
    });
  };

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(e);
      }}
      noValidate
      className="space-y-4"
    >
      <Input
        label="Vendor Name"
        placeholder="e.g. Swift Logistics"
        value={form.vendorName}
        onChange={(e) => {
          setForm((p) => ({ ...p, vendorName: e.target.value }));
          if (errors.vendorName) setErrors((p) => ({ ...p, vendorName: undefined }));
        }}
        error={errors.vendorName}
        required
      />
      <Input
        label="Expected Rate (₹)"
        type="number"
        placeholder="e.g. 45000"
        value={form.expectedRate}
        onChange={(e) => {
          setForm((p) => ({ ...p, expectedRate: e.target.value }));
          if (errors.expectedRate) setErrors((p) => ({ ...p, expectedRate: undefined }));
        }}
        error={errors.expectedRate}
        min={1}
        required
      />
      <Input
        label="Remarks"
        placeholder="Optional remarks..."
        value={form.remarks}
        onChange={(e) => {
          setForm((p) => ({ ...p, remarks: e.target.value }));
        }}
      />
      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">Add Vendor</Button>
      </div>
    </form>
  );
};
