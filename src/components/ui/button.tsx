import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2563AB]/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary:
      'gradient-bg-blue text-white hover:opacity-90 shadow-md shadow-[#1A4880]/20 active:scale-[0.98]',
    secondary:
      'bg-[#EAF0F8] text-[#1A4880] hover:bg-[#D0DCEA] border border-[#CBD8EA] active:scale-[0.98]',
    outline:
      'bg-transparent text-[#2563AB] border border-[#2563AB]/60 hover:bg-[#2563AB]/10 active:scale-[0.98]',
    ghost:
      'bg-transparent text-[#3A5272] hover:text-[#0F2D54] hover:bg-[#EAF0F8]',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/20 active:scale-[0.98]',
    success:
      'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5 font-bold',
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
};
