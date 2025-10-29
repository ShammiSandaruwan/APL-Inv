// src/pages/dashboard/DashboardPage.tsx
import {
  Button,
  Grid,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconBuilding,
  IconBuildingEstate,
  IconPackage,
} from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { showErrorToast } from '../../utils/toast';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between">
        <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
          {title}
        </Text>
        <ThemeIcon color={color} variant="light" size={38} radius="md">
          {icon}
        </ThemeIcon>
      </Group>
      <Text fz={32} fw={700} mt="md">
        {value}
      </Text>
    </Paper>
  );
};

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({ estates: 0, buildings: 0, items: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const { count: estatesCount, error: estatesError } = await supabase
          .from('estates')
          .select('*', { count: 'exact', head: true });
        const { count: buildingsCount, error: buildingsError } = await supabase
          .from('buildings')
          .select('*', { count: 'exact', head: true });
        const { count: itemsCount, error: itemsError } = await supabase
          .from('items')
          .select('*', { count: 'exact', head: true });

        if (estatesError || buildingsError || itemsError) {
          throw new Error('Failed to load dashboard statistics.');
        }
        setStats({
          estates: estatesCount || 0,
          buildings: buildingsCount || 0,
          items: itemsCount || 0,
        });
      } catch (error: any) {
        showErrorToast(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Stack gap="lg">
      <Title order={2}>Dashboard</Title>
      <Text c="dimmed">
        Welcome back! Here's a snapshot of your asset ecosystem.
      </Text>
      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <StatCard
            title="Total Estates"
            value={stats.estates}
            icon={<IconBuildingEstate size={24} />}
            color="blue"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <StatCard
            title="Total Buildings"
            value={stats.buildings}
            icon={<IconBuilding size={24} />}
            color="indigo"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <StatCard
            title="Total Items"
            value={stats.items}
            icon={<IconPackage size={24} />}
            color="teal"
          />
        </Grid.Col>
      </Grid>
      <Paper withBorder p="md" radius="md">
        <Title order={4} mb="md">
          Quick Actions
        </Title>
        <Group grow>
          <Button component={Link} to="/estates" variant="light">
            Manage Estates
          </Button>
          <Button component={Link} to="/buildings" variant="light">
            Manage Buildings
          </Button>
          <Button component={Link} to="/items" variant="light">
            Manage Items
          </Button>
        </Group>
      </Paper>
    </Stack>
  );
};

export default DashboardPage;
