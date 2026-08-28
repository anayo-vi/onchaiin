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
    success: 'bg-[#0ECB81]/15 text-[#0ECB81] border-[#0ECB81]/35',
    warning: 'bg-[#FCD535]/15 text-[#FCD535] border-[#FCD535]/35',
    danger:  'bg-[#F6465D]/15 text-[#F6465D] border-[#F6465D]/35',
    info:    'bg-sky-500/10 text-sky-400 border-sky-500/30',
    purple:  'bg-[#FCD535]/15 text-[#FCD535] border-[#FCD535]/35',
    blue:    'bg-[#FCD535]/15 text-[#FCD535] border-[#FCD535]/35',
    neutral: 'bg-[#2B2F36] text-[#848E9C] border-[#363A45]',
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
