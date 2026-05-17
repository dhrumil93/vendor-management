import { useState, type FormEvent } from 'react';
import * as yup from 'yup';
import { toast } from 'sonner';
import { useAppDispatch } from '@/app/hooks';
import { updateUser } from '@/features/users/userSlice';
import { BRANCHES } from '@/utils/constants';
import { Input } from '@/components/ui/Input';
import { AppSelect } from '@/components/ui/AppSelect';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import type { EditUserFormProps } from './EditUserForm.types';

interface EditUserFormData {
  name: string;
  email: string;
  username: string;
  branch: string;
  isActive: boolean;
}

type EditUserFormErrors = Partial<Record<keyof EditUserFormData, string>>;

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Valid email required').required('Email is required'),
  username: yup.string().required('Username is required'),
  branch: yup.string().required('Branch is required'),
  isActive: yup.boolean().required(),
});

export const EditUserForm = ({ user, onSuccess, onCancel }: EditUserFormProps) => {
  const dispatch = useAppDispatch();

  const [form, setForm] = useState<EditUserFormData>({
    name: user.name,
    email: user.email,
    username: user.username,
    branch: user.branch,
    isActive: user.isActive,
  });
  const [errors, setErrors] = useState<EditUserFormErrors>({});

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    try {
      await schema.validate(form, { abortEarly: false });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const mapped: EditUserFormErrors = {};
        err.inner.forEach((e) => {
          if (e.path) mapped[e.path as keyof EditUserFormData] = e.message;
        });
        setErrors(mapped);
      }
      return;
    }
    try {
      await dispatch(updateUser({ id: user.id, ...form })).unwrap();
      toast.success('User updated successfully!');
      onSuccess();
    } catch {
      toast.error('Failed to update user. Please try again.');
    }
  };

  const branchOptions = BRANCHES.map((b) => ({ value: b, label: b }));

  return (
    <form
      onSubmit={(ev) => {
        void handleSubmit(ev);
      }}
      noValidate
      className="space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          value={form.name}
          onChange={(e) => {
            setForm((p) => ({ ...p, name: e.target.value }));
          }}
          error={errors.name}
          required
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => {
            setForm((p) => ({ ...p, email: e.target.value }));
          }}
          error={errors.email}
          required
        />
        <Input
          label="Username"
          value={form.username}
          onChange={(e) => {
            setForm((p) => ({ ...p, username: e.target.value }));
          }}
          error={errors.username}
          required
        />
        <AppSelect
          label="Branch"
          value={form.branch}
          onChange={(v) => {
            setForm((p) => ({ ...p, branch: v }));
          }}
          options={branchOptions}
          error={errors.branch}
          isSearchable={false}
          required
        />
        <div className="flex flex-col gap-1">
          <label className="type-label">Status</label>
          <div className="flex items-center h-10">
            <Toggle
              checked={form.isActive}
              onChange={(checked) => {
                setForm((p) => ({ ...p, isActive: checked }));
              }}
              label={form.isActive ? 'Active' : 'Inactive'}
            />
          </div>
        </div>
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
