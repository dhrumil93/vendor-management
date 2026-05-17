import ReactSelect, { type StylesConfig } from 'react-select';
import type { AppSelectOption, AppSelectProps } from './AppSelect.types';

const css = (varName: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(varName).trim();

const customStyles: StylesConfig<AppSelectOption, false> = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? css('--color-primary') : css('--color-border-dark'),
    boxShadow: state.isFocused ? `0 0 0 2px ${css('--color-primary')}29` : 'none',
    borderRadius: '0.5rem',
    minHeight: '40px',
    fontSize: '0.875rem',
    backgroundColor: state.isDisabled ? css('--color-bg') : css('--color-surface'),
    '&:hover': { borderColor: css('--color-primary') },
    cursor: state.isDisabled ? 'not-allowed' : 'default',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? css('--color-primary')
      : state.isFocused
        ? css('--color-surface-raised')
        : css('--color-surface'),
    color: state.isSelected ? '#ffffff' : css('--color-text'),
    fontSize: '0.875rem',
    cursor: 'pointer',
    '&:active': { backgroundColor: css('--color-primary-hover') },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: css('--color-surface'),
    borderRadius: '0.5rem',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    border: `1px solid ${css('--color-border-dark')}`,
    overflow: 'hidden',
    zIndex: 50,
  }),
  menuList: (base) => ({
    ...base,
    backgroundColor: css('--color-surface'),
    padding: '4px',
  }),
  placeholder: (base) => ({
    ...base,
    color: css('--color-text-faint'),
    fontSize: '0.875rem',
  }),
  singleValue: (base) => ({
    ...base,
    color: css('--color-text'),
    fontSize: '0.875rem',
  }),
  input: (base) => ({
    ...base,
    color: css('--color-text'),
    fontSize: '0.875rem',
  }),
  indicatorSeparator: (base) => ({
    ...base,
    backgroundColor: css('--color-border-dark'),
  }),
  clearIndicator: (base) => ({
    ...base,
    color: css('--color-text-faint'),
    '&:hover': { color: css('--color-text-muted') },
    cursor: 'pointer',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: css('--color-text-faint'),
    '&:hover': { color: css('--color-text-muted') },
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

export const AppSelect = ({
  label,
  error,
  options,
  value,
  onChange,
  placeholder = 'Select...',
  isClearable = false,
  isSearchable = true,
  required = false,
  wrapperClassName = '',
  isDisabled = false,
  id,
}: AppSelectProps) => {
  const selectedOption = options.find((o) => o.value === value) ?? null;
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1 ${wrapperClassName}`}>
      {label && (
        <label htmlFor={inputId} className="type-label block">
          {label}
          {required && <span className="text-required ml-0.5">*</span>}
        </label>
      )}
      <ReactSelect<AppSelectOption, false>
        inputId={inputId}
        options={options}
        value={selectedOption}
        onChange={(opt) => {
          onChange(opt?.value ?? '');
        }}
        placeholder={placeholder}
        isClearable={isClearable}
        isSearchable={isSearchable}
        isDisabled={isDisabled}
        styles={customStyles}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        classNamePrefix="app-select"
      />
      {error && <p className="type-error mt-0.5">{error}</p>}
    </div>
  );
};
