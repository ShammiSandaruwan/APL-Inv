// src/pages/estates/EstateDetailPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { showErrorToast } from '../../utils/toast';
import type { Estate } from './EstatesPage';
import type { Building } from '../../types';
import { Loader, Center, Title, Paper, Text, SimpleGrid, Card } from '@mantine/core';

const EstateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [estate, setEstate] = useState<Estate | null>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEstateDetails = async () => {
      if (!id) return;
      setIsLoading(true);

      const { data: estateData, error: estateError } = await supabase
        .from('estates')
        .select('*')
        .eq('id', id)
        .single();

      if (estateError) {
        showErrorToast(estateError.message);
      } else {
        setEstate(estateData as Estate);
      }

      const { data: buildingsData, error: buildingsError } = await supabase
        .from('buildings')
        .select('*')
        .eq('estate_id', id);

      if (buildingsError) {
        showErrorToast(buildingsError.message);
      } else {
        setBuildings(buildingsData as Building[]);
      }

      setIsLoading(false);
    };

    fetchEstateDetails();
  }, [id]);

  if (isLoading) {
    return (
      <Center style={{ height: '100%' }}>
        <Loader />
      </Center>
    );
  }

  if (!estate) {
    return <Text>Estate not found.</Text>;
  }

  return (
    <div>
      <Title order={2} mb="lg">{estate.name}</Title>
      <Paper withBorder shadow="sm" p="lg" mb="xl">
        <Title order={4} mb="md">Details</Title>
        <Text><strong>Code:</strong> {estate.code}</Text>
        <Text><strong>Location:</strong> {estate.location}</Text>
        <Text><strong>Description:</strong> {estate.description}</Text>
      </Paper>

      <Title order={3} mb="lg">Buildings in this Estate</Title>
      {buildings.length === 0 ? (
        <Text>No buildings found in this estate.</Text>
      ) : (
        <SimpleGrid
          cols={3}
          spacing="lg"
          breakpoints={[
            { maxWidth: 'md', cols: 2 },
            { maxWidth: 'sm', cols: 1 },
          ]}
        >
          {buildings.map(building => (
            <Card withBorder shadow="sm" key={building.id}>
              <Title order={5}>{building.name}</Title>
              <Text><strong>Code:</strong> {building.code}</Text>
              <Text><strong>Type:</strong> {building.building_type}</Text>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </div>
  );
};

export default EstateDetailPage;
