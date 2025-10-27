// src/pages/dashboard/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { showErrorToast } from '../../utils/toast';
import StatCard from '../../components/StatCard';
import { FaBuilding, FaBoxOpen, FaGlobeAmericas } from 'react-icons/fa';
import Spinner from '../../components/Spinner';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({ estates: 0, buildings: 0, items: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      const { count: estatesCount, error: estatesError } = await supabase.from('estates').select('*', { count: 'exact', head: true });
      const { count: buildingsCount, error: buildingsError } = await supabase.from('buildings').select('*', { count: 'exact', head: true });
      const { count: itemsCount, error: itemsError } = await supabase.from('items').select('*', { count: 'exact', head: true });

      if (estatesError || buildingsError || itemsError) {
        showErrorToast('Failed to load dashboard statistics.');
      } else {
        setStats({
          estates: estatesCount || 0,
          buildings: buildingsCount || 0,
          items: itemsCount || 0,
        });
      }
      setIsLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-mine-shaft">Welcome, Super Admin!</h1>
        <p className="text-scorpion mt-2">
          Here's a quick overview of your asset management system.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Estates" value={stats.estates} icon={<FaGlobeAmericas className="text-salem" />} />
          <StatCard title="Total Buildings" value={stats.buildings} icon={<FaBuilding className="text-salem" />} />
          <StatCard title="Total Items" value={stats.items} icon={<FaBoxOpen className="text-salem" />} />
        </div>
      )}

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
