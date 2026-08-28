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
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#3A5272]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-[#7A95B4] pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              'glass-input w-full rounded-xl px-4 py-3 text-sm text-[#0F1F3D] placeholder:text-[#9BB2CB] focus:outline-none transition-all duration-200',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-200',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-[#7A95B4]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-rose-500 font-medium mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
