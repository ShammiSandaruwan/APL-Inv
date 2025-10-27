// src/components/StatCard.tsx
import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
      <div className="bg-gin p-3 rounded-full mr-4">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-scorpion">{title}</h3>
        <p className="text-2xl font-bold text-mine-shaft">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
