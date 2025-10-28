// src/components/Input.tsx
import React from 'react';

// Define the props for the Input component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, id, name, error, className = '', ...props }) => {
  // Base styles for the input
  const baseStyles =
    'mt-1 block w-full px-4 py-2.5 bg-white border border-gin-dark rounded-lg text-base shadow-sm placeholder-scorpion focus:outline-none focus:ring-2 focus:ring-bay-leaf focus:border-transparent transition-all duration-300';

  // Styles for when there is an error
  const errorStyles = 'border-red-500 text-red-600 focus:ring-red-500';

  // Combine styles
  const combinedClassName = `
    ${baseStyles}
    ${error ? errorStyles : ''}
    ${className}
  `;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id || name} className="block text-sm font-medium text-mine-shaft">
          {label}
        </label>
      )}
      <input id={id || name} name={name} className={combinedClassName} {...props} />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
