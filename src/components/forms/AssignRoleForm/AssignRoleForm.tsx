import { useState, type FormEvent } from 'react';
import * as yup from 'yup';
import { Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { assignRole } from '@/features/users/userSlice';
import { AppSelect } from '@/components/ui/AppSelect';
import { Button } from '@/components/ui/Button';
import type { AssignRoleFormProps } from './AssignRoleForm.types';

interface AssignRoleFormData {
  userId: string;
  roleId: string;
}

type AssignRoleFormErrors = Partial<Record<keyof AssignRoleFormData, string>>;

const emptyForm: AssignRoleFormData = { userId: '', roleId: '' };

const schema = yup.object({
  userId: yup.string().required('Please select a user'),
  roleId: yup.string().required('Please select a role'),
});

export const AssignRoleForm = ({ onSuccess, onCancel }: AssignRoleFormProps) => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.users);
  const roles = useAppSelector((state) => state.roles.roles);

  const [form, setForm] = useState<AssignRoleFormData>(emptyForm);
  const [errors, setErrors] = useState<AssignRoleFormErrors>({});

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    try {
      await schema.validate(form, { abortEarly: false });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const mapped: AssignRoleFormErrors = {};
        err.inner.forEach((e) => {
          if (e.path) mapped[e.path as keyof AssignRoleFormData] = e.message;
        });
        setErrors(mapped);
      }
      return;
    }
    try {
      await dispatch(assignRole({ userId: form.userId, roleId: form.roleId })).unwrap();
      toast.success('Role assigned successfully!');
      setForm(emptyForm);
      setErrors({});
      onSuccess();
    } catch {
      toast.error('Failed to assign role. Please try again.');
    }
  };

  const userOptions = users.map((u) => ({ value: u.id, label: `${u.name} (${u.username})` }));
  const roleOptions = roles.map((r) => ({ value: r.id, label: r.name }));

  return (
    <form
      onSubmit={(ev) => {
        void handleSubmit(ev);
      }}
      noValidate
      className="space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AppSelect
          label="Select User"
          value={form.userId}
          onChange={(v) => {
            setForm((p) => ({ ...p, userId: v }));
          }}
          options={userOptions}
          placeholder="Choose a user..."
          error={errors.userId}
          required
        />
        <AppSelect
          label="Select Role"
          value={form.roleId}
          onChange={(v) => {
            setForm((p) => ({ ...p, roleId: v }));
          }}
          options={roleOptions}
          placeholder="Choose a role..."
          error={errors.roleId}
          required
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">
          <Link2 size={16} />
          Save Mapping
        </Button>
      </div>
    </form>
  );
};
