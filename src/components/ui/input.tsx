import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#848E9C]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-[#848E9C] pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              'glass-input w-full rounded-xl px-4 py-3 text-sm text-[#EAECEF] placeholder:text-[#848E9C] focus:outline-none transition-all duration-200',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-[#F6465D]/80 focus:border-[#F6465D]',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-[#848E9C]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-[#F6465D] font-medium mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
