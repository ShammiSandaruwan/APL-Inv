// src/components/Button.tsx
import React from 'react';

// Define the props for the Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  ...props
}) => {
  // Base styles for the button
  const baseStyles = 'rounded-md font-semibold focus:outline-none transition-all duration-200 shadow-subtle hover:shadow-lifted transform hover:-translate-y-0.5';

  // Variant-specific styles using the provided color palette
  const variantStyles = {
    primary: 'bg-salem text-white hover:bg-salem-dark focus:ring-2 focus:ring-salem-light focus:ring-offset-2',
    secondary: 'bg-white text-mine-shaft border border-gin-dark hover:bg-gin-light focus:ring-2 focus:ring-bay-leaf focus:ring-offset-2',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
  };

  // Size-specific styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Disabled state styles
  const disabledStyles = 'disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none';

  // Combine all styles
  const combinedClassName = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${disabledStyles}
    ${className}
  `;

  return (
    <button className={combinedClassName} disabled={isLoading} {...props}>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          Processing...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
