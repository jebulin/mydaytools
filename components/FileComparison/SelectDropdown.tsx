import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectDropdownProps {
  id: string;
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  smallText?: string;
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({
  id,
  label,
  options,
  value,
  onChange,
  required = false,
  disabled = false,
  placeholder = 'Select option',
  smallText,
}) => {
  return (
    <div className="form-col">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        className="custom-select"
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        disabled={disabled}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {smallText && <small>{smallText}</small>}
    </div>
  );
};

export default SelectDropdown;
