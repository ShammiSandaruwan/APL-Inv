// src/components/Input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, id, name, error, className = '', ...props }) => {
  const baseStyles = 'block w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200';

  const errorStyles = 'border-danger text-danger focus:ring-danger';

  const combinedClassName = [
    baseStyles,
    error ? errorStyles : '',
    className
  ].join(' ');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id || name} className="block text-sm font-semibold text-text-primary mb-1.5">
          {label}
        </label>
      )}
      <input id={id || name} name={name} className={combinedClassName.trim()} {...props} />
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
};

export default Input;
