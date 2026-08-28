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
    'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FCD535]/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary:
      'gradient-bg-blue text-[#0B0E11] hover:opacity-95 shadow-lg shadow-[#FCD535]/25 active:scale-[0.98]',
    secondary:
      'bg-[#2B2F36] text-[#EAECEF] hover:bg-[#363A45] border border-[#363A45] active:scale-[0.98]',
    outline:
      'bg-transparent text-[#FCD535] border border-[#FCD535]/50 hover:bg-[#FCD535]/10 active:scale-[0.98]',
    ghost:
      'bg-transparent text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B2F36]/50',
    danger:
      'bg-[#F6465D] text-white hover:bg-[#D9384E] shadow-lg shadow-[#F6465D]/20 active:scale-[0.98]',
    success:
      'bg-[#0ECB81] text-[#0B0E11] hover:bg-[#0BB974] shadow-lg shadow-[#0ECB81]/20 active:scale-[0.98]',
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
