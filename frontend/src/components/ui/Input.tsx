import type { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  error?: string;
  containerClassName?: string;
}

export function Input({
  id,
  label,
  error,
  containerClassName = '',
  className = '',
  ...rest
}: InputProps) {
  const inputClasses = ['field-input', className].filter(Boolean).join(' ');

  return (
    <div className={`form-field ${containerClassName}`.trim()}>
      {label && (
        <label className="field-label" htmlFor={id}>
          {label}
        </label>
      )}
      <input id={id} className={inputClasses} {...rest} />
      {error && (
        <span
          style={{
            display: 'block',
            fontSize: '0.75rem',
            color: 'var(--accent-danger)',
            marginTop: '4px',
          }}
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
}
