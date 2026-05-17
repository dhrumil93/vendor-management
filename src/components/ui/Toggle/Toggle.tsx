import type { ToggleProps } from './Toggle.types';

export const Toggle = ({ checked, onChange, label, size = 'md' }: ToggleProps) => {
  const trackW = size === 'sm' ? 'w-9' : 'w-11';
  const trackH = size === 'sm' ? 'h-5' : 'h-6';
  const thumbSz = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5';
  const thumbTranslate = size === 'sm' ? 'translate-x-4' : 'translate-x-5';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => {
        onChange(!checked);
      }}
      className={`flex items-center gap-2 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full`}
    >
      <span
        className={`relative inline-flex items-center ${trackW} ${trackH} rounded-full transition-colors duration-200 ${
          checked ? 'bg-primary' : 'bg-border-dark'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 ${thumbSz} bg-surface rounded-full shadow-sm transition-transform duration-200 ${
            checked ? thumbTranslate : 'translate-x-0'
          }`}
        />
      </span>
      {label && (
        <span className={`text-sm font-medium ${checked ? 'text-text' : 'text-text-muted'}`}>
          {label}
        </span>
      )}
    </button>
  );
};
