import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import type { CSSProperties, ReactNode } from 'react';
import { Button } from './Button';

export interface BackButtonProps {
  onClick: () => void;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export function BackButton({
  onClick,
  children = 'Volver al temario',
  style,
  className = '',
}: BackButtonProps) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} style={style} className={className}>
      <ArrowLeftIcon style={{ width: 14, height: 14 }} aria-hidden="true" />
      {children}
    </Button>
  );
}
