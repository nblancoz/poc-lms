import type { ReactNode } from 'react';

export interface BadgeProps {
  variant?: 'enrolled' | 'noaccess' | 'custom' | 'brand';
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = 'custom', children, className = '' }: BadgeProps) {
  const baseClass = variant === 'brand' ? 'brand-badge' : `badge-status ${variant}`;

  return <span className={`${baseClass} ${className}`.trim()}>{children}</span>;
}
