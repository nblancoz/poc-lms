export interface StatusDotProps {
  variant: 'enrolled' | 'noaccess' | 'danger';
  className?: string;
}

export function StatusDot({ variant, className = '' }: StatusDotProps) {
  return <span className={`status-dot ${variant} ${className}`.trim()} aria-hidden="true" />;
}
