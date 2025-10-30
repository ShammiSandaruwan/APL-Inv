// src/pages/items/ItemDetailPage.tsx
import {
  Container,
  Grid,
  Image,
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
import type { Item } from '../../types';
import { showErrorToast } from '../../utils/toast';

const ItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchItemDetails = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('items')
          .select('*, buildings(*, estates(*))')
          .eq('id', id)
          .single();
        if (error) throw error;
        if (isMounted) setItem(data as Item);
      } catch (error: any) {
        showErrorToast(error.message || 'Failed to fetch item details.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchItemDetails();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  if (!item) {
    return <Text>Item not found.</Text>;
  }

  return (
    <Container fluid>
      <Stack gap="lg">
        <Title order={2}>{item.name}</Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper withBorder p="md" radius="md">
              <Title order={4} mb="sm">
                Details
              </Title>
              <Text>
                <strong>Code:</strong> {item.item_code}
              </Text>
              <Text>
                <strong>Estate:</strong> {item.buildings?.estates?.name || 'N/A'}
              </Text>
              <Text>
                <strong>Building:</strong> {item.buildings?.name || 'N/A'}
              </Text>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper withBorder p="md" radius="md">
              <Title order={4} mb="sm">
                Photos
              </Title>
              {item.photos && item.photos.length > 0 ? (
                <SimpleGrid cols={2}>
                  {item.photos.map((photo) => (
                    <Image key={photo} src={photo} alt={item.name} radius="sm" />
                  ))}
                </SimpleGrid>
              ) : (
                <Text>No photos available for this item.</Text>
              )}
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
};

export default ItemDetailPage;
