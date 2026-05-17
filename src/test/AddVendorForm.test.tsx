import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddVendorForm } from '@/components/forms/AddVendorForm';

describe('AddVendorForm', () => {
  it('renders all fields and the submit button', () => {
    render(<AddVendorForm onSuccess={vi.fn()} />);

    expect(screen.getByLabelText(/vendor name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/expected rate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/remarks/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add vendor/i })).toBeInTheDocument();
  });

  it('shows Yup validation errors when submitted empty', async () => {
    render(<AddVendorForm onSuccess={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /add vendor/i }));

    await waitFor(() => {
      expect(screen.getByText(/vendor name is required/i)).toBeInTheDocument();
    });
  });

  it('shows rate error when expected rate is missing', async () => {
    render(<AddVendorForm onSuccess={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/vendor name/i), {
      target: { value: 'Test Vendor' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add vendor/i }));

    await waitFor(() => {
      expect(screen.getByText(/expected rate must be a number/i)).toBeInTheDocument();
    });
  });

  it('shows error when rate is zero', async () => {
    render(<AddVendorForm onSuccess={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/vendor name/i), {
      target: { value: 'Test Vendor' },
    });
    fireEvent.change(screen.getByLabelText(/expected rate/i), {
      target: { value: '0' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add vendor/i }));

    await waitFor(() => {
      expect(screen.getByText(/must be greater than 0/i)).toBeInTheDocument();
    });
  });

  it('shows error when rate is negative', async () => {
    render(<AddVendorForm onSuccess={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/vendor name/i), {
      target: { value: 'Test Vendor' },
    });
    fireEvent.change(screen.getByLabelText(/expected rate/i), {
      target: { value: '-500' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add vendor/i }));

    await waitFor(() => {
      expect(screen.getByText(/must be greater than 0/i)).toBeInTheDocument();
    });
  });

  it('clears vendor name error when user starts typing', async () => {
    render(<AddVendorForm onSuccess={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /add vendor/i }));
    await waitFor(() => {
      expect(screen.getByText(/vendor name is required/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/vendor name/i), {
      target: { value: 'A' },
    });

    expect(screen.queryByText(/vendor name is required/i)).not.toBeInTheDocument();
  });

  it('clears rate error when user starts typing', async () => {
    render(<AddVendorForm onSuccess={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/vendor name/i), {
      target: { value: 'Test Vendor' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add vendor/i }));
    await waitFor(() => {
      expect(screen.getByText(/expected rate must be a number/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/expected rate/i), {
      target: { value: '1000' },
    });

    expect(screen.queryByText(/expected rate must be a number/i)).not.toBeInTheDocument();
  });

  it('calls onSuccess with correct data on valid submission', async () => {
    const onSuccess = vi.fn();
    render(<AddVendorForm onSuccess={onSuccess} />);

    fireEvent.change(screen.getByLabelText(/vendor name/i), {
      target: { value: 'Swift Logistics' },
    });
    fireEvent.change(screen.getByLabelText(/expected rate/i), {
      target: { value: '45000' },
    });
    fireEvent.change(screen.getByLabelText(/remarks/i), {
      target: { value: 'Reliable' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add vendor/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledOnce();
      expect(onSuccess).toHaveBeenCalledWith({
        vendorName: 'Swift Logistics',
        expectedRate: 45000,
        remarks: 'Reliable',
      });
    });
  });

  it('trims whitespace from vendor name before calling onSuccess', async () => {
    const onSuccess = vi.fn();
    render(<AddVendorForm onSuccess={onSuccess} />);

    fireEvent.change(screen.getByLabelText(/vendor name/i), {
      target: { value: '  Swift Logistics  ' },
    });
    fireEvent.change(screen.getByLabelText(/expected rate/i), {
      target: { value: '45000' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add vendor/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ vendorName: 'Swift Logistics' }),
      );
    });
  });

  it('remarks is optional — submits successfully without it', async () => {
    const onSuccess = vi.fn();
    render(<AddVendorForm onSuccess={onSuccess} />);

    fireEvent.change(screen.getByLabelText(/vendor name/i), {
      target: { value: 'Test Vendor' },
    });
    fireEvent.change(screen.getByLabelText(/expected rate/i), {
      target: { value: '1000' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add vendor/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledOnce();
    });
  });

  it('does not render Cancel button when onCancel is not provided', () => {
    render(<AddVendorForm onSuccess={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
  });

  it('renders Cancel button when onCancel is provided', () => {
    render(<AddVendorForm onSuccess={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('calls onCancel when Cancel is clicked', () => {
    const onCancel = vi.fn();
    render(<AddVendorForm onSuccess={vi.fn()} onCancel={onCancel} />);

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledOnce();
  });
});
