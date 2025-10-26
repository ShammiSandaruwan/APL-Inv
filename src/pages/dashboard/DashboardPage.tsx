// src/pages/dashboard/DashboardPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
      <p>This is a protected area.</p>
      <div className="mt-8">
        <h2 className="text-xl font-semibold">Management Sections</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/estates" className="p-4 bg-white rounded-lg shadow hover:bg-gin transition-colors">
            Manage Estates
          </Link>
          <Link to="/buildings" className="p-4 bg-white rounded-lg shadow hover:bg-gin transition-colors">
            Manage Buildings
          </Link>
          <Link to="/items" className="p-4 bg-white rounded-lg shadow hover:bg-gin transition-colors">
            Manage Items
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
