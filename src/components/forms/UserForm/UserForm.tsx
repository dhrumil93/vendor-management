import { useState, type FormEvent } from 'react';
import * as yup from 'yup';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/app/hooks';
import { addUser } from '@/features/users/userSlice';
import { BRANCHES } from '@/utils/constants';
import { Input } from '@/components/ui/Input';
import { AppSelect } from '@/components/ui/AppSelect';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import type { UserFormProps } from './UserForm.types';

interface UserFormData {
  name: string;
  email: string;
  username: string;
  password: string;
  branch: string;
  isActive: boolean;
}

type UserFormErrors = Partial<Record<keyof UserFormData, string>>;

const emptyForm: UserFormData = {
  name: '',
  email: '',
  username: '',
  password: '',
  branch: 'Mumbai',
  isActive: true,
};

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Valid email required').required('Email is required'),
  username: yup.string().required('Username is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  branch: yup.string().required('Branch is required'),
  isActive: yup.boolean().required(),
});

export const UserForm = ({ onSuccess, onCancel }: UserFormProps) => {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<UserFormData>(emptyForm);
  const [errors, setErrors] = useState<UserFormErrors>({});

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    try {
      await schema.validate(form, { abortEarly: false });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const mapped: UserFormErrors = {};
        err.inner.forEach((e) => {
          if (e.path) mapped[e.path as keyof UserFormData] = e.message;
        });
        setErrors(mapped);
      }
      return;
    }
    try {
      await dispatch(addUser(form)).unwrap();
      toast.success('User created successfully!');
      setForm(emptyForm);
      setErrors({});
      onSuccess();
    } catch {
      toast.error('Failed to create user. Please try again.');
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
        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => {
            setForm((p) => ({ ...p, password: e.target.value }));
          }}
          error={errors.password}
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
        <Button type="submit">
          <UserPlus size={16} />
          Create User
        </Button>
      </div>
    </form>
  );
};
