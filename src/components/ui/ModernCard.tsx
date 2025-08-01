import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient' | 'elevated' | 'minimal';
  hover?: boolean;
  onClick?: () => void;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  icon?: LucideIcon;
  iconColor?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const ModernCard: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>;
  Content: React.FC<CardContentProps>;
  Footer: React.FC<CardFooterProps>;
} = ({ children, className = '', variant = 'default', hover = false, onClick }) => {
  const baseClasses = 'rounded-2xl transition-all duration-300';

  const variantClasses = {
    default: 'bg-white border border-gray-200 shadow-lg',
    glass: 'bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg',
    gradient: 'bg-gradient-to-br from-blue-50 to-purple-50 border border-white/20 shadow-lg',
    elevated: 'bg-white shadow-xl border border-gray-100',
    minimal: 'bg-gray-50 border border-gray-100',
  };

  const hoverClasses = hover ? 'hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  const classes = [
    baseClasses,
    variantClasses[variant],
    hoverClasses,
    clickableClasses,
    className,
  ].join(' ');

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
  icon: Icon,
  iconColor = 'text-blue-600',
}) => {
  return (
    <div className={`p-6 ${className}`}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={`p-2 rounded-lg bg-blue-50 ${iconColor}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return <div className={`px-6 pb-6 ${className}`}>{children}</div>;
};

const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  return <div className={`px-6 pb-6 pt-0 ${className}`}>{children}</div>;
};

ModernCard.Header = CardHeader;
ModernCard.Content = CardContent;
ModernCard.Footer = CardFooter;

export default ModernCard;
