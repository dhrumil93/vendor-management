import type { InputProps } from './Input.types';

export const Input = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  wrapperClassName = '',
  className = '',
  id,
  required,
  ...rest
}: InputProps) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`flex flex-col gap-1 ${wrapperClassName}`}>
      {label && (
        <label htmlFor={inputId} className="type-label block">
          {label}
          {required && <span className="text-required ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          required={required}
          className={[
            'w-full rounded-lg border px-3 py-2 text-sm text-text',
            'placeholder:text-text-faint bg-surface',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'disabled:bg-bg disabled:text-text-muted disabled:cursor-not-allowed',
            'transition-colors duration-150',
            error ? 'border-required focus:ring-required' : 'border-border-dark',
            leftIcon ? 'pl-9' : '',
            rightIcon ? 'pr-9' : '',
            className,
          ].join(' ')}
          {...rest}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-faint">
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p className="type-error mt-0.5">{error}</p>}
      {helperText && !error && <p className="type-caption mt-0.5">{helperText}</p>}
    </div>
  );
};
