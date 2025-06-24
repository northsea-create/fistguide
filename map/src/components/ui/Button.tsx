import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  ...props 
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl rounded-2xl',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-2xl',
    outline: 'border-2 border-emerald-500 hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 rounded-2xl',
    ghost: 'hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 rounded-xl'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}