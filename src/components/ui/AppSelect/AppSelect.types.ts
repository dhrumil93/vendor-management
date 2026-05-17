export interface AppSelectOption {
  value: string;
  label: string;
}

export interface AppSelectProps {
  label?: string;
  error?: string;
  options: AppSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isClearable?: boolean;
  isSearchable?: boolean;
  required?: boolean;
  wrapperClassName?: string;
  isDisabled?: boolean;
  id?: string;
}
