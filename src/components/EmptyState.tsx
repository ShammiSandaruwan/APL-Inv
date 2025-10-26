// src/components/EmptyState.tsx
import React from 'react';
import Button from './Button';
import { FaInbox } from 'react-icons/fa';

interface EmptyStateProps {
  title: string;
  message: string;
  actionText: string;
  onActionClick: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, message, actionText, onActionClick }) => {
  return (
    <div className="text-center bg-white p-8 rounded-lg shadow-md">
      <FaInbox className="mx-auto h-12 w-12 text-silver-chalice" />
      <h3 className="mt-4 text-lg font-medium text-mine-shaft">{title}</h3>
      <p className="mt-2 text-sm text-scorpion">{message}</p>
      <div className="mt-6">
        <Button onClick={onActionClick} className="flex items-center mx-auto">
          {actionText}
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;
