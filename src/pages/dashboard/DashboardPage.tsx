// src/pages/dashboard/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { showErrorToast } from '../../utils/toast';
import { Card, Grid, Text } from '@mantine/core';
import StatCard from '../../components/ui/StatCard';
import { IconBuilding, IconBox, IconWorld } from '@tabler/icons-react';
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
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <StatCard title="Total Estates" value={stats.estates} icon={<IconWorld />} color="blue" />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <StatCard title="Total Buildings" value={stats.buildings} icon={<IconBuilding />} color="grape" />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <StatCard title="Total Items" value={stats.items} icon={<IconBox />} color="teal" />
          </Grid.Col>
        </Grid>
      )}

      <Card withBorder radius="md" padding="lg">
        <Text fw={500} size="lg" mb="md">Quick Actions</Text>
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Link to="/estates" className="block p-4 rounded-md hover:bg-gray-50">
              <Text fw={500}>Manage Estates</Text>
              <Text size="sm" c="dimmed">Oversee all estates and properties.</Text>
            </Link>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Link to="/buildings" className="block p-4 rounded-md hover:bg-gray-50">
              <Text fw={500}>Manage Buildings</Text>
              <Text size="sm" c="dimmed">Track factories, bungalows, and staff quarters.</Text>
            </Link>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Link to="/items" className="block p-4 rounded-md hover:bg-gray-50">
              <Text fw={500}>Manage Items</Text>
              <Text size="sm" c="dimmed">Keep a detailed inventory of all assets.</Text>
            </Link>
          </Grid.Col>
        </Grid>
      </Card>
    </div>
  );
};

export default DashboardPage;
