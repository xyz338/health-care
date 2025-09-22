import React from 'react';
import Spinner from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'danger' | 'secondary';
  size?: 'sm' | 'md';
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', isLoading = false, className = '', ...props }) => {
  const baseClasses = 'rounded-md font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-500 focus:ring-offset-slate-100',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-slate-100',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-slate-100',
    secondary: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 focus:ring-offset-slate-100',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};

export default Button;