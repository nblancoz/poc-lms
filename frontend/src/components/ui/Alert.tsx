import type { HTMLAttributes, ReactNode } from 'react';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'error' | 'info' | 'warning';
  children: ReactNode;
  className?: string;
}

export function Alert({ variant = 'error', children, className = '', ...rest }: AlertProps) {
  const baseClass =
    variant === 'error' ? 'form-error' : variant === 'warning' ? 'alert-warning' : 'info-box';
  const role = variant === 'error' ? 'alert' : 'status';

  return (
    <div className={`${baseClass} ${className}`.trim()} role={role} {...rest}>
      {children}
    </div>
  );
}
