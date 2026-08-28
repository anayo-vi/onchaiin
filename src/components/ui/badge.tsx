import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'blue' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className,
}) => {
  const variants = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger:  'bg-rose-50 text-rose-700 border-rose-200',
    info:    'bg-sky-50 text-sky-700 border-sky-200',
    purple:  'bg-[#EAF0F8] text-[#1A4880] border-[#CBD8EA]',
    blue:    'bg-[#EAF0F8] text-[#1A4880] border-[#CBD8EA]',
    neutral: 'bg-[#F4F7FB] text-[#3A5272] border-[#D0DCEA]',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border tracking-wide font-semibold',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};
