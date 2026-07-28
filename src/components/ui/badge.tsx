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
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    info: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    purple: 'bg-[#6EB7FF]/15 text-[#6EB7FF] border-[#6EB7FF]/35',
    blue: 'bg-[#6EB7FF]/15 text-[#6EB7FF] border-[#6EB7FF]/35',
    neutral: 'bg-slate-800 text-slate-300 border-slate-700',
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
