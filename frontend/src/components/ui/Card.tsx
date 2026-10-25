import type { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section' | 'article';
  children: ReactNode;
  className?: string;
}

export function Card({ as: Component = 'div', children, className = '', ...rest }: CardProps) {
  return (
    <Component className={`content-card ${className}`.trim()} {...rest}>
      {children}
    </Component>
  );
}
