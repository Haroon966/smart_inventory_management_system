import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        className={`
          px-4 py-2 
          border border-gray-300 
          rounded-lg
          bg-white 
          text-gray-900
          placeholder-gray-400
          transition-all duration-200
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-500/50
          focus:border-blue-500
          hover:border-gray-400
          ${className}
        `}
        {...props}
      />
    </div>
  );
}; 