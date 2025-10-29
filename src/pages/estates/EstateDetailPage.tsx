// src/pages/estates/EstateDetailPage.tsx
import {
  Container,
  Grid,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import type { Building, Estate } from '../../types';
import { showErrorToast } from '../../utils/toast';

const EstateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [estate, setEstate] = useState<Estate | null>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEstateDetails = async () => {
      if (!id) return;
      setIsLoading(true);

      try {
        const { data: estateData, error: estateError } = await supabase
          .from('estates')
          .select('*')
          .eq('id', id)
          .single();
        if (estateError) throw estateError;
        setEstate(estateData as Estate);

        const { data: buildingsData, error: buildingsError } = await supabase
          .from('buildings')
          .select('*')
          .eq('estate_id', id);
        if (buildingsError) throw buildingsError;
        setBuildings(buildingsData as Building[]);
      } catch (error: any) {
        showErrorToast(error.message || 'Failed to fetch estate details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEstateDetails();
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  if (!estate) {
    return <Text>Estate not found.</Text>;
  }

  return (
    <Container fluid>
      <Stack gap="lg">
        <Title order={2}>{estate.name}</Title>
        <Paper withBorder p="md" radius="md">
          <Title order={4} mb="sm">
            Details
          </Title>
          <Grid>
            <Grid.Col span={6}>
              <Text fw={500}>Code:</Text>
              <Text>{estate.code}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text fw={500}>Location:</Text>
              <Text>{estate.location}</Text>
            </Grid.Col>
            <Grid.Col span={12}>
              <Text fw={500}>Description:</Text>
              <Text>{estate.description || 'N/A'}</Text>
            </Grid.Col>
          </Grid>
        </Paper>

        <Title order={3}>Buildings in this Estate</Title>
        {buildings.length === 0 ? (
          <Text>No buildings found in this estate.</Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
            {buildings.map((building) => (
              <Paper withBorder p="md" radius="md" key={building.id}>
                <Text fw={500}>{building.name}</Text>
                <Text size="sm" c="dimmed">
                  Code: {building.code}
                </Text>
                <Text size="sm" c="dimmed">
                  Type: {building.building_type}
                </Text>
              </Paper>
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Container>
  );
};

export default EstateDetailPage;
