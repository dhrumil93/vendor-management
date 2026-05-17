import { useState, type FormEvent } from 'react';
import * as yup from 'yup';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/app/hooks';
import { addRole, updateRole } from '@/features/roles/roleSlice';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { RoleFormProps } from './RoleForm.types';

interface RoleFormData {
  name: string;
  description: string;
}

type RoleFormErrors = Partial<Record<keyof RoleFormData, string>>;

const emptyForm: RoleFormData = { name: '', description: '' };

const schema = yup.object({
  name: yup.string().required('Role name is required'),
  description: yup.string().required('Description is required'),
});

export const RoleForm = ({ role, onSuccess, onCancel }: RoleFormProps) => {
  const dispatch = useAppDispatch();
  const isEditing = role !== undefined;

  const [form, setForm] = useState<RoleFormData>(
    isEditing ? { name: role.name, description: role.description } : emptyForm,
  );
  const [errors, setErrors] = useState<RoleFormErrors>({});

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    try {
      await schema.validate(form, { abortEarly: false });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const mapped: RoleFormErrors = {};
        err.inner.forEach((e) => {
          if (e.path) mapped[e.path as keyof RoleFormData] = e.message;
        });
        setErrors(mapped);
      }
      return;
    }
    try {
      if (isEditing) {
        await dispatch(
          updateRole({ id: role.id, name: form.name.trim(), description: form.description.trim() }),
        ).unwrap();
        toast.success('Role updated successfully!');
      } else {
        await dispatch(
          addRole({ name: form.name.trim(), description: form.description.trim() }),
        ).unwrap();
        toast.success('Role created successfully!');
        setForm(emptyForm);
      }
      setErrors({});
      onSuccess();
    } catch {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} role. Please try again.`);
    }
  };

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
          label="Role Name"
          placeholder="e.g. Supervisor"
          value={form.name}
          onChange={(e) => {
            setForm((p) => ({ ...p, name: e.target.value }));
          }}
          error={errors.name}
          required
        />
        <Input
          label="Description"
          placeholder="Brief role description"
          value={form.description}
          onChange={(e) => {
            setForm((p) => ({ ...p, description: e.target.value }));
          }}
          error={errors.description}
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
          {!isEditing && <Plus size={16} />}
          {isEditing ? 'Save Changes' : 'Create Role'}
        </Button>
      </div>
    </form>
  );
};
