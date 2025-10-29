// src/pages/dashboard/DashboardPage.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { showErrorToast } from '../../utils/toast';
import { Title, Text, SimpleGrid, Loader, Center, Grid, Select, Group } from '@mantine/core';
import { BarChart } from '@mantine/charts';
import { IconBuilding, IconBox, IconWorld, IconUsers } from '@tabler/icons-react';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import type { Estate } from '../estates/EstatesPage';
import type { Item } from '../../types';

interface ChartData {
  estate: string;
  buildings: number;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({ estates: 0, buildings: 0, items: 0, users: 0 });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [recentItems, setRecentItems] = useState<Item[]>([]);
  const [estates, setEstates] = useState<Estate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter state
  const [selectedEstate, setSelectedEstate] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<string | null>('30'); // Default to 30 days

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);

      // 1. Fetch all estates for the filter dropdown
      const { data: estatesData, error: estatesError } = await supabase.from('estates').select('id, name');
      if (estatesError) showErrorToast('Failed to load estates.');
      else setEstates(estatesData as Estate[]);

      // 2. Fetch core statistics
      const { count: estatesCount } = await supabase.from('estates').select('*', { count: 'exact', head: true });
      const { count: buildingsCount } = await supabase.from('buildings').select('*', { count: 'exact', head: true });
      const { count: itemsCount } = await supabase.from('items').select('*', { count: 'exact', head: true });
      const { count: usersCount } = await supabase.from('user_profiles').select('*', { count: 'exact', head: true });
      setStats({
        estates: estatesCount || 0,
        buildings: buildingsCount || 0,
        items: itemsCount || 0,
        users: usersCount || 0,
      });

      // 3. Fetch data for buildings per estate chart
      const { data: buildingsPerEstate, error: chartError } = await supabase.rpc('get_buildings_per_estate');
      if (chartError) showErrorToast('Failed to load chart data.');
      else setChartData(buildingsPerEstate.map((d: any) => ({ estate: d.name, buildings: d.building_count })));

      // 4. Fetch recent items
      const { data: recentItemsData, error: itemsError } = await supabase
        .from('items')
        .select('*, estates!inner(name)')
        .order('created_at', { ascending: false })
        .limit(5);

      if (itemsError) showErrorToast('Failed to load recent items.');
      else setRecentItems(recentItemsData as any[]); // Supabase typing can be tricky here

      setIsLoading(false);
    };

    fetchDashboardData();
  }, [selectedEstate, selectedDateRange]); // Re-fetch when filters change (logic to be added)

  if (isLoading) {
    return <Center style={{ height: '100%' }}><Loader /></Center>;
  }

  return (
    <div>
      <Group position="apart" mb="xl">
        <div>
          <Title order={2}>Dashboard</Title>
          <Text color="dimmed">Welcome back! Here's a snapshot of your asset ecosystem.</Text>
        </div>
        <Group>
          <Select
            placeholder="Filter by Estate"
            clearable
            data={estates.map(e => ({ value: e.id, label: e.name }))}
            value={selectedEstate}
            onChange={setSelectedEstate}
          />
          <Select
            placeholder="Select Date Range"
            value={selectedDateRange}
            onChange={setSelectedDateRange}
            data={[
              { value: '7', label: 'Last 7 Days' },
              { value: '30', label: 'Last 30 Days' },
              { value: '180', label: 'Last 6 Months' },
            ]}
          />
        </Group>
      </Group>

      <SimpleGrid cols={4} breakpoints={[{ maxWidth: 'md', cols: 2 }, { maxWidth: 'xs', cols: 1 }]} mb="xl">
        <StatCard title="Total Estates" value={stats.estates} icon={<IconWorld size={24} />} color="blue" />
        <StatCard title="Total Buildings" value={stats.buildings} icon={<IconBuilding size={24} />} color="teal" />
        <StatCard title="Total Items" value={stats.items} icon={<IconBox size={24} />} color="amber" />
        <StatCard title="Total Users" value={stats.users} icon={<IconUsers size={24} />} color="grape" />
      </SimpleGrid>

      <Grid gutter="xl">
        <Grid.Col md={7}>
          <Title order={4} mb="md">Buildings per Estate</Title>
          <BarChart
            h={300}
            data={chartData}
            dataKey="estate"
            series={[{ name: 'buildings', color: 'blue.6' }]}
            tickLine="y"
          />
        </Grid.Col>
        <Grid.Col md={5}>
          <Title order={4} mb="md">Recent Items</Title>
          <DataTable
            records={recentItems}
            columns={[
              { accessor: 'name', title: 'Item Name' },
              { accessor: 'estates.name', title: 'Estate' },
              {
                accessor: 'created_at',
                title: 'Added Date',
                render: ({ created_at }) => new Date(created_at).toLocaleDateString(),
              },
            ]}
            recordsPerPage={5}
          />
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default DashboardPage;
