// src/pages/dashboard/DashboardPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-mine-shaft">Welcome, Super Admin!</h1>
        <p className="text-scorpion mt-2">
          Here's a quick overview of your asset management system.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-mine-shaft">Management Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Estate Management Card */}
          <Link to="/estates" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold text-salem">Manage Estates</h3>
            <p className="text-scorpion mt-2 text-sm">
              View, create, edit, and delete the core estate properties.
            </p>
          </Link>

          {/* Building Management Card */}
          <Link to="/buildings" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold text-salem">Manage Buildings</h3>
            <p className="text-scorpion mt-2 text-sm">
              Organize and track all buildings within each estate.
            </p>
          </Link>

          {/* Item Management Card */}
          <Link to="/items" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold text-salem">Manage Items</h3>
            <p className="text-scorpion mt-2 text-sm">
              Keep a detailed inventory of all assets and items.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
