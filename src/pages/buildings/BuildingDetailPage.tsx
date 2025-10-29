// src/pages/buildings/BuildingDetailPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { showErrorToast } from '../../utils/toast';
import type { Building, Item } from '../../types';
import { Loader, Center, Title, Paper, Text, SimpleGrid, Card } from '@mantine/core';

const BuildingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [building, setBuilding] = useState<Building | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBuildingDetails = async () => {
      if (!id) return;
      setIsLoading(true);

      const { data: buildingData, error: buildingError } = await supabase
        .from('buildings')
        .select('*, estates(*)')
        .eq('id', id)
        .single();

      if (buildingError) {
        showErrorToast(buildingError.message);
      } else {
        setBuilding(buildingData as Building);
      }

      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('*')
        .eq('building_id', id);

      if (itemsError) {
        showErrorToast(itemsError.message);
      } else {
        setItems(itemsData as Item[]);
      }

      setIsLoading(false);
    };

    fetchBuildingDetails();
  }, [id]);

  if (isLoading) {
    return (
      <Center style={{ height: '100%' }}>
        <Loader />
      </Center>
    );
  }

  if (!building) {
    return <Text>Building not found.</Text>;
  }

  return (
    <div>
      <Title order={2} mb="lg">{building.name}</Title>
      <Paper withBorder shadow="sm" p="lg" mb="xl">
        <Title order={4} mb="md">Details</Title>
        <Text><strong>Code:</strong> {building.code}</Text>
        <Text><strong>Estate:</strong> {building.estates?.name}</Text>
        <Text><strong>Type:</strong> {building.building_type}</Text>
      </Paper>

      <Title order={3} mb="lg">Items in this Building</Title>
      {items.length === 0 ? (
        <Text>No items found in this building.</Text>
      ) : (
        <SimpleGrid
          cols={3}
          spacing="lg"
          breakpoints={[
            { maxWidth: 'md', cols: 2 },
            { maxWidth: 'sm', cols: 1 },
          ]}
        >
          {items.map(item => (
            <Card withBorder shadow="sm" key={item.id}>
              <Title order={5}>{item.name}</Title>
              <Text><strong>Code:</strong> {item.item_code}</Text>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </div>
  );
};

export default BuildingDetailPage;
