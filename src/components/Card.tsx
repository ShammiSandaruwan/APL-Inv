// src/components/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  const cardClassName = `
    bg-white shadow-md rounded-lg overflow-hidden
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
