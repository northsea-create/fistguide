import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-lg font-semibold text-gray-800">
          {label}
        </label>
      )}
      <input
        className={`pop-input w-full ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}