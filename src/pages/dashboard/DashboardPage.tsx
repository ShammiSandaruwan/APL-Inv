// src/pages/dashboard/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { showErrorToast } from '../../utils/toast';
import Card from '../../components/Card';
import { FaBuilding, FaBoxOpen, FaGlobeAmericas } from 'react-icons/fa';
import Spinner from '../../components/Spinner';

const StatDisplay: React.FC<{ title: string; value: number; icon: React.ReactNode; gradient: string }> = ({ title, value, icon, gradient }) => (
  <Card className="hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center">
      <div className={`p-4 rounded-2xl text-white ${gradient}`}>
        {React.cloneElement(icon as React.ReactElement, { className: 'text-3xl' })}
      </div>
      <div className="ml-6">
        <p className="text-sm font-medium text-text-secondary">{title}</p>
        <p className="text-3xl font-bold text-text-primary">{value}</p>
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
    <div className="space-y-10 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary mt-2 text-lg">
          Welcome back! Here's a snapshot of your asset ecosystem.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatDisplay title="Total Estates" value={stats.estates} icon={<FaGlobeAmericas />} gradient="bg-gradient-to-br from-primary to-blue-400" />
          <StatDisplay title="Total Buildings" value={stats.buildings} icon={<FaBuilding />} gradient="bg-gradient-to-br from-secondary to-purple-400" />
          <StatDisplay title="Total Items" value={stats.items} icon={<FaBoxOpen />} gradient="bg-gradient-to-br from-accent-green to-teal-400" />
        </div>
      )}

      <Card title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
          <Link to="/estates" className="block p-6 rounded-xl hover:bg-background transition-colors">
            <h3 className="text-lg font-semibold text-primary">Manage Estates</h3>
            <p className="text-text-secondary mt-2 text-sm">
              Oversee all 15 estates, view details, and manage properties.
            </p>
          </Link>
          <Link to="/buildings" className="block p-6 rounded-xl hover:bg-background transition-colors">
            <h3 className="text-lg font-semibold text-primary">Manage Buildings</h3>
            <p className="text-text-secondary mt-2 text-sm">
              Track factories, bungalows, and staff quarters.
            </p>
          </Link>
          <Link to="/items" className="block p-6 rounded-xl hover:bg-background transition-colors">
            <h3 className="text-lg font-semibold text-primary">Manage Items</h3>
            <p className="text-text-secondary mt-2 text-sm">
              Keep a detailed inventory of all assets and equipment.
            </p>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
