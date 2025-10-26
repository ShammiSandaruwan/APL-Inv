// src/components/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  const cardClassName = `
    bg-white shadow-md rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1
    ${className}
  `;

  return (
    <div className={cardClassName}>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default Card;
