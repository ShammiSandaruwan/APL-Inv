// src/pages/dashboard/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { showErrorToast } from '../../utils/toast';
import Card from '../../components/Card';
import { FaBuilding, FaBoxOpen, FaGlobeAmericas } from 'react-icons/fa';
import Spinner from '../../components/Spinner';

const StatDisplay: React.FC<{ title: string; value: number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <Card>
    <div className="flex items-center">
      <div className="p-3 bg-primary-light rounded-lg">
        {React.cloneElement(icon as React.ReactElement, { className: 'text-primary text-2xl' })}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-text-secondary">{title}</p>
        <p className="text-2xl font-semibold text-text-primary">{value}</p>
      </div>
    </div>
  </Card>
);

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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Welcome, Super Admin!</h1>
        <p className="text-text-secondary mt-1">
          Here's a quick overview of your asset management system.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatDisplay title="Total Estates" value={stats.estates} icon={<FaGlobeAmericas />} />
          <StatDisplay title="Total Buildings" value={stats.buildings} icon={<FaBuilding />} />
          <StatDisplay title="Total Items" value={stats.items} icon={<FaBoxOpen />} />
        </div>
      )}

      <Card title="Management Sections">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/estates" className="block p-4 rounded-lg hover:bg-background transition-colors">
            <h3 className="text-md font-semibold text-primary">Manage Estates</h3>
            <p className="text-text-secondary mt-1 text-sm">
              View, create, edit, and delete the core estate properties.
            </p>
          </Link>
          <Link to="/buildings" className="block p-4 rounded-lg hover:bg-background transition-colors">
            <h3 className="text-md font-semibold text-primary">Manage Buildings</h3>
            <p className="text-text-secondary mt-1 text-sm">
              Organize and track all buildings within each estate.
            </p>
          </Link>
          <Link to="/items" className="block p-4 rounded-lg hover:bg-background transition-colors">
            <h3 className="text-md font-semibold text-primary">Manage Items</h3>
            <p className="text-text-secondary mt-1 text-sm">
              Keep a detailed inventory of all assets and items.
            </p>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
