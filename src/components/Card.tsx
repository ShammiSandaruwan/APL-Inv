// src/components/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  actions?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, actions }) => {
  const cardClassName = `bg-white border border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${className}`;

  return (
    <div className={cardClassName}>
      {(title || actions) && (
        <div className="flex justify-between items-center p-4 border-b border-border">
          {title && <h3 className="text-lg font-semibold text-text-primary">{title}</h3>}
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
