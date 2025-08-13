import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500',
    secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-base',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const classes = [baseClasses, variantClasses[variant], sizeClasses[size], className].join(' ');

  const iconClasses = iconSizeClasses[size];

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading ? (
        <div
          className={`animate-spin rounded-full border-2 border-current border-t-transparent ${iconClasses} ${children ? 'mr-2' : ''}`}
        />
      ) : Icon && iconPosition === 'left' ? (
        <Icon className={`${iconClasses} ${children ? 'mr-2' : ''}`} />
      ) : null}

      {children}

      {Icon && iconPosition === 'right' && !loading ? (
        <Icon className={`${iconClasses} ${children ? 'ml-2' : ''}`} />
      ) : null}
    </button>
  );
};

export default Button;
