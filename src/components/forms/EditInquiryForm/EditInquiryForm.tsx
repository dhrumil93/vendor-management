import { useState, type FormEvent } from 'react';
import * as yup from 'yup';
import { toast } from 'sonner';
import { useAppDispatch } from '@/app/hooks';
import { updateInquiry } from '@/features/inquiries/inquirySlice';
import type { VehicleType, MaterialType, InquiryStatus } from '@/types';
import { VEHICLE_TYPES, MATERIAL_TYPES, INQUIRY_STATUSES } from '@/utils/constants';
import { Input } from '@/components/ui/Input';
import { AppSelect } from '@/components/ui/AppSelect';
import { Button } from '@/components/ui/Button';
import type { EditInquiryFormProps } from './EditInquiryForm.types';

interface EditInquiryFormData {
  date: string;
  customerName: string;
  fromLocation: string;
  toLocation: string;
  vehicleType: VehicleType;
  materialType: MaterialType;
  weight: number;
  notes: string;
  status: InquiryStatus;
}

type EditInquiryFormErrors = Partial<Record<keyof EditInquiryFormData, string>>;

const schema = yup.object({
  date: yup.string().required('Date is required'),
  customerName: yup.string().required('Customer name is required'),
  fromLocation: yup.string().required('From location is required'),
  toLocation: yup.string().required('To location is required'),
  vehicleType: yup
    .string()
    .oneOf(VEHICLE_TYPES, 'Invalid vehicle type')
    .required('Vehicle type is required'),
  materialType: yup
    .string()
    .oneOf(MATERIAL_TYPES, 'Invalid material type')
    .required('Material type is required'),
  weight: yup
    .number()
    .typeError('Weight must be a number')
    .min(1, 'Weight must be greater than 0')
    .required('Weight is required'),
  status: yup.string().oneOf(INQUIRY_STATUSES, 'Invalid status').required('Status is required'),
  notes: yup.string(),
});

export const EditInquiryForm = ({ inquiry, onSuccess, onCancel }: EditInquiryFormProps) => {
  const dispatch = useAppDispatch();

  const [form, setForm] = useState<EditInquiryFormData>({
    date: inquiry.date,
    customerName: inquiry.customerName,
    fromLocation: inquiry.fromLocation,
    toLocation: inquiry.toLocation,
    vehicleType: inquiry.vehicleType,
    materialType: inquiry.materialType,
    weight: inquiry.weight,
    notes: inquiry.notes ?? '',
    status: inquiry.status,
  });
  const [errors, setErrors] = useState<EditInquiryFormErrors>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await schema.validate(form, { abortEarly: false });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const mapped: EditInquiryFormErrors = {};
        err.inner.forEach((ve) => {
          if (ve.path) mapped[ve.path as keyof EditInquiryFormData] = ve.message;
        });
        setErrors(mapped);
      }
      return;
    }
    try {
      await dispatch(updateInquiry({ id: inquiry.id, ...form })).unwrap();
      toast.success('Inquiry updated successfully!');
      onSuccess();
    } catch {
      toast.error('Failed to update inquiry. Please try again.');
    }
  };

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(e);
      }}
      noValidate
      className="space-y-5"
    >
      <div className="bg-surface-raised border border-border-dark rounded-xl px-4 py-3">
        <p className="type-caption mb-0.5">Inquiry No</p>
        <p className="font-semibold text-text">{inquiry.inquiryNo}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Date"
          type="date"
          value={form.date}
          onChange={(e) => {
            setForm((p) => ({ ...p, date: e.target.value }));
          }}
          error={errors.date}
          required
        />
        <Input
          label="Customer Name"
          value={form.customerName}
          onChange={(e) => {
            setForm((p) => ({ ...p, customerName: e.target.value }));
          }}
          error={errors.customerName}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="From Location"
          value={form.fromLocation}
          onChange={(e) => {
            setForm((p) => ({ ...p, fromLocation: e.target.value }));
          }}
          error={errors.fromLocation}
          required
        />
        <Input
          label="To Location"
          value={form.toLocation}
          onChange={(e) => {
            setForm((p) => ({ ...p, toLocation: e.target.value }));
          }}
          error={errors.toLocation}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AppSelect
          label="Vehicle Type"
          value={form.vehicleType}
          onChange={(v) => {
            setForm((p) => ({ ...p, vehicleType: v as VehicleType }));
          }}
          options={VEHICLE_TYPES.map((v) => ({ value: v, label: v }))}
          error={errors.vehicleType}
          isSearchable={false}
          required
        />
        <AppSelect
          label="Material Type"
          value={form.materialType}
          onChange={(v) => {
            setForm((p) => ({ ...p, materialType: v as MaterialType }));
          }}
          options={MATERIAL_TYPES.map((m) => ({ value: m, label: m }))}
          error={errors.materialType}
          isSearchable={false}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Weight (kg)"
          type="number"
          min={1}
          value={form.weight === 0 ? '' : form.weight}
          onChange={(e) => {
            setForm((p) => ({ ...p, weight: parseFloat(e.target.value) || 0 }));
          }}
          error={errors.weight}
          required
        />
        <AppSelect
          label="Status"
          value={form.status}
          onChange={(v) => {
            setForm((p) => ({ ...p, status: v as InquiryStatus }));
          }}
          options={INQUIRY_STATUSES.map((s) => ({ value: s, label: s }))}
          isSearchable={false}
        />
      </div>

      <div>
        <label className="type-label block mb-1">Notes</label>
        <textarea
          className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text bg-surface placeholder:text-text-faint focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
          rows={3}
          placeholder="Any special instructions or notes..."
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
