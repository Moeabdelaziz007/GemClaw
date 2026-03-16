'use client';

import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  ghost: 'bg-transparent border-transparent hover:bg-white/5',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  md: '', // default
  lg: 'btn-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      children,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = `
      relative inline-flex items-center justify-center gap-2
      font-bold uppercase tracking-wider
      transition-all duration-300
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#050505]
      ${variant === 'primary' ? 'focus:ring-neon-green' : ''}
      ${variant === 'secondary' ? 'focus:ring-neon-blue' : ''}
      ${variant === 'danger' ? 'focus:ring-red-500' : ''}
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${className}
    `.trim();

    return (
      <motion.button
        ref={ref as any}
        className={baseClasses}
        disabled={disabled || isLoading}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        {...props}
      >
        {isLoading && (
          <Loader2 className="w-4 h-4 animate-spin absolute left-1/2 -translate-x-1/2" />
        )}
        
        <span className={isLoading ? 'invisible' : 'relative flex items-center justify-center gap-2'}>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
