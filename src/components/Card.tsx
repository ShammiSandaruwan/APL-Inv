// src/components/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  const cardClassName = `
    bg-white border border-gin-dark rounded-lg overflow-hidden transition-all duration-300 shadow-subtle hover:shadow-lifted hover:-translate-y-1
    ${className}
  `;

  return (
    <div className={cardClassName}>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
