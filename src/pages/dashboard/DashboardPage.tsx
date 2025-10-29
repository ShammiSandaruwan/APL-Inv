// src/pages/dashboard/DashboardPage.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { showErrorToast } from '../../utils/toast';
import { Card, Grid, Text, Group, ThemeIcon, Loader, Title, SimpleGrid, Paper, UnstyledButton } from '@mantine/core';
import { IconBuilding, IconBox, IconWorld } from '@tabler/icons-react';
import type { ReactNode } from 'react';

interface StatDisplayProps {
  title: string;
  value: number;
  icon: ReactNode;
  color: string;
}

const StatDisplay: React.FC<StatDisplayProps> = ({ title, value, icon, color }) => (
  <Paper withBorder p="md" radius="md">
    <Group>
      <ThemeIcon color={color} variant="light" size={60} radius="md">
        {icon}
      </ThemeIcon>
      <div>
        <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
          {title}
        </Text>
        <Text weight={700} size="xl">
          {value}
        </Text>
      </div>
    </Group>
  </Paper>
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
    <div style={{ animation: 'fadeIn 1s' }}>
      <Title order={1}>Dashboard</Title>
      <Text color="dimmed" mt="sm" mb="xl">
        Welcome back! Here's a snapshot of your asset ecosystem.
      </Text>

      {isLoading ? (
        <Group position="center" py="xl">
          <Loader />
        </Group>
      ) : (
        <SimpleGrid
          cols={3}
          spacing="lg"
          breakpoints={[
            { maxWidth: 'md', cols: 2 },
            { maxWidth: 'sm', cols: 1 },
          ]}
        >
          <StatDisplay title="Total Estates" value={stats.estates} icon={<IconWorld size={32} />} color="indigo" />
          <StatDisplay title="Total Buildings" value={stats.buildings} icon={<IconBuilding size={32} />} color="blue" />
          <StatDisplay title="Total Items" value={stats.items} icon={<IconBox size={32} />} color="teal" />
        </SimpleGrid>
      )}

      <Card withBorder radius="md" mt="xl">
        <Title order={3} mb="md">Quick Actions</Title>
        <SimpleGrid
          cols={3}
          spacing="lg"
          breakpoints={[
            { maxWidth: 'sm', cols: 1 },
          ]}
        >
          <UnstyledButton component={Link} to="/estates">
            <Paper withBorder p="md" radius="sm" sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}>
              <Text color="indigo" weight={500}>Manage Estates</Text>
              <Text size="sm" color="dimmed" mt={4}>
                Oversee all estates, view details, and manage properties.
              </Text>
            </Paper>
          </UnstyledButton>
          <UnstyledButton component={Link} to="/buildings">
            <Paper withBorder p="md" radius="sm" sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}>
              <Text color="indigo" weight={500}>Manage Buildings</Text>
              <Text size="sm" color="dimmed" mt={4}>
                Track factories, bungalows, and staff quarters.
              </Text>
            </Paper>
          </UnstyledButton>
          <UnstyledButton component={Link} to="/items">
            <Paper withBorder p="md" radius="sm" sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}>
              <Text color="indigo" weight={500}>Manage Items</Text>
              <Text size="sm" color="dimmed" mt={4}>
                Keep a detailed inventory of all assets and equipment.
              </Text>
            </Paper>
          </UnstyledButton>
        </SimpleGrid>
      </Card>
    </div>
  );
};

export default DashboardPage;
