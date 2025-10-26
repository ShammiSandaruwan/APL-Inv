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
  const baseStyles = 'rounded-md font-semibold focus:outline-none transition-all duration-200';

  // Variant-specific styles using the provided color palette
  const variantStyles = {
    primary: 'bg-salem text-white hover:bg-goblin focus:ring-2 focus:ring-salem focus:ring-offset-2 active:scale-95',
    secondary: 'bg-gin text-mine-shaft hover:bg-gum-leaf focus:ring-2 focus:ring-bay-leaf focus:ring-offset-2 active:scale-95',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:scale-95',
  };

  // Size-specific styles
  const sizeStyles = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Disabled state styles
  const disabledStyles = 'disabled:opacity-50 disabled:cursor-not-allowed';

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
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
