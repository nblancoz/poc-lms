import type { ReactNode } from 'react';

export interface SelectableCardProps {
  title: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  isActive?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
}

export function SelectableCard({
  title,
  subtitle,
  description,
  isActive = false,
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
}: SelectableCardProps) {
  const classes = ['switcher-btn', isActive ? 'active' : '', className].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-pressed={isActive}
    >
      <div className="switcher-btn-top">
        {title}
        {isLoading && <span className="spinner-light" aria-hidden="true" />}
      </div>
      {subtitle && <div className="switcher-btn-email">{subtitle}</div>}
      {description && <div className="switcher-btn-desc">{description}</div>}
    </button>
  );
}
