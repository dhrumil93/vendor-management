import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Lock, User, Eye, EyeOff, Package, Users, BarChart3, Shield } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { login, clearError } from '@/features/auth/authSlice';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const DEMO_CREDENTIALS = [
  {
    role: 'Admin',
    username: 'admin',
    password: 'admin123',
    color: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  },
  {
    role: 'Manager',
    username: 'manager1',
    password: 'manager123',
    color: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  },
  {
    role: 'Operator',
    username: 'operator1',
    password: 'operator123',
    color: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
  },
  {
    role: 'Viewer',
    username: 'viewer1',
    password: 'viewer123',
    color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  },
];

const FEATURES = [
  { icon: <Package size={18} />, text: 'Track logistics inquiries end-to-end' },
  { icon: <Truck size={18} />, text: 'Manage vendor quotes in real time' },
  { icon: <Users size={18} />, text: 'Role-based access for every team' },
  { icon: <BarChart3 size={18} />, text: 'Reports and print-ready documents' },
];

export const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const error = useAppSelector((state) => state.auth.error);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [form, setForm] = useState({ username: '', password: '' });
  const [validationErrors, setValidationErrors] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const errs = { username: '', password: '' };
    if (!form.username.trim()) errs.username = 'Username is required';
    if (!form.password.trim()) errs.password = 'Password is required';
    setValidationErrors(errs);
    return !errs.username && !errs.password;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    dispatch(clearError());
    dispatch(login({ username: form.username, password: form.password })).finally(() =>
      setLoading(false),
    );
  };

  const fillCredentials = (username: string, password: string) => {
    setForm({ username, password });
    setValidationErrors({ username: '', password: '' });
    dispatch(clearError());
  };

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-[#0D1117] via-[#0D1117] to-[#0a1628]">
        {/* Background glow orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-blue-600/5 rounded-full blur-2xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl shadow-lg shadow-primary/30">
            <Truck size={20} className="text-white" />
          </div>
          <span className="text-lg font-bold text-text">LogiTrack</span>
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-text leading-tight mb-4">
            Hi, Welcome
            <br />
            Back
          </h1>
          <p className="text-text-muted text-base mb-10">
            Logistics Inquiry &amp; Vendor Quote System
          </p>

          {/* Feature list */}
          <div className="space-y-4">
            {FEATURES.map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary shrink-0">
                  {f.icon}
                </div>
                <span className="text-sm text-text-muted">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom role badges */}
        <div className="relative z-10 flex items-center gap-2 flex-wrap">
          {DEMO_CREDENTIALS.map((d) => (
            <span
              key={d.role}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${d.color}`}
            >
              <Shield size={11} />
              {d.role}
            </span>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Truck size={16} className="text-white" />
            </div>
            <span className="font-bold text-text">LogiTrack</span>
          </div>

          <h2 className="text-2xl font-bold text-text mb-1">Sign in to your account</h2>
          <p className="text-sm text-text-muted mb-8">Enter your credentials to continue</p>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 px-4 py-3 bg-danger-light border border-danger/30 rounded-xl text-sm text-danger">
              <span className="mt-0.5 shrink-0">⚠</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input
              label="Username"
              type="text"
              placeholder="Enter your username"
              value={form.username}
              onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
              error={validationErrors.username}
              leftIcon={<User size={15} />}
              autoComplete="username"
              required
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              error={validationErrors.password}
              leftIcon={<Lock size={15} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="text-text-faint hover:text-text-muted transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
              autoComplete="current-password"
              required
            />

            <Button type="submit" className="w-full mt-2" loading={loading} size="lg">
              Sign In
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-text-muted mb-3 font-medium uppercase tracking-wider">
              Demo credentials — click to autofill
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_CREDENTIALS.map((d) => (
                <button
                  key={d.role}
                  type="button"
                  onClick={() => fillCredentials(d.username, d.password)}
                  className={`text-left p-3 rounded-xl border transition-all hover:scale-[1.02] active:scale-100 ${d.color}`}
                >
                  <p className="text-xs font-semibold mb-1">{d.role}</p>
                  <p className="text-[11px] opacity-70 font-mono">{d.username}</p>
                  <p className="text-[11px] opacity-70 font-mono">{d.password}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
