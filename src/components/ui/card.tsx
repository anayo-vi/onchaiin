import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverable = false,
  glow = false,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'glass-card rounded-2xl p-6 transition-all duration-300',
        hoverable && 'glass-card-hover',
        glow && 'blue-glow border-[#6EB7FF]/40',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
