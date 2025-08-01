import React from 'react';
import { LucideIcon, Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'destructive'
    | 'gradient'
    | 'gradient-blue'
    | 'glass'
    | 'ghost'
    | 'outline'
    | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  children: React.ReactNode;
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
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95',
    secondary:
      'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 shadow-sm hover:shadow-md hover:scale-105 active:scale-95',
    destructive:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95',
    gradient:
      'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl focus:ring-blue-500 hover:scale-105 active:scale-95',
    'gradient-blue':
      'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500 hover:scale-105 active:scale-95',
    glass:
      'bg-white/80 backdrop-blur-sm text-gray-900 hover:bg-white/90 focus:ring-blue-500 border border-white/20 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95',
    ghost:
      'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500 hover:scale-105 active:scale-95',
    outline:
      'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500 hover:scale-105 active:scale-95',
    success:
      'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95',
  };

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  const iconSizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };

  const classes = [baseClasses, variantClasses[variant], sizeClasses[size], className].join(' ');

  const iconClasses = iconSizeClasses[size];
  const showIcon = Icon && !loading;
  const showLoader = loading;

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {showLoader && (
        <Loader2 className={`${iconClasses} animate-spin ${children ? 'mr-2' : ''}`} />
      )}

      {showIcon && iconPosition === 'left' && (
        <Icon className={`${iconClasses} ${children ? 'mr-2' : ''}`} />
      )}

      {children}

      {showIcon && iconPosition === 'right' && (
        <Icon className={`${iconClasses} ${children ? 'ml-2' : ''}`} />
      )}
    </button>
  );
};

export default Button;
