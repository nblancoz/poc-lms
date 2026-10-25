import type { HTMLAttributes, ReactNode } from 'react';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'error' | 'info';
  children: ReactNode;
  className?: string;
}

export function Alert({ variant = 'error', children, className = '', ...rest }: AlertProps) {
  const baseClass = variant === 'error' ? 'form-error' : 'info-box';
  const role = variant === 'error' ? 'alert' : 'status';

  return (
    <div className={`${baseClass} ${className}`.trim()} role={role} {...rest}>
      {children}
    </div>
  );
}
