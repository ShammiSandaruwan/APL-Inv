// src/pages/items/ItemDetailPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { showErrorToast } from '../../utils/toast';
import type { Item } from '../../types';
import { Loader, Center, Title, Paper, Text, SimpleGrid, Card, Image } from '@mantine/core';

const ItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!id) return;
      setIsLoading(true);

      const { data, error } = await supabase
        .from('items')
        .select('*, buildings(*, estates(*))')
        .eq('id', id)
        .single();

      if (error) {
        showErrorToast(error.message);
      } else {
        setItem(data as Item);
      }

      setIsLoading(false);
    };

    fetchItemDetails();
  }, [id]);

  if (isLoading) {
    return (
      <Center style={{ height: '100%' }}>
        <Loader />
      </Center>
    );
  }

  if (!item) {
    return <Text>Item not found.</Text>;
  }

  return (
    <div>
      <Title order={2} mb="lg">{item.name}</Title>
      <SimpleGrid cols={2} spacing="lg" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        <Paper withBorder shadow="sm" p="lg">
          <Title order={4} mb="md">Details</Title>
          <Text><strong>Code:</strong> {item.item_code}</Text>
          <Text><strong>Estate:</strong> {item.buildings?.estates?.name}</Text>
          <Text><strong>Building:</strong> {item.buildings?.name}</Text>
        </Paper>
        <Paper withBorder shadow="sm" p="lg">
          <Title order={4} mb="md">Photos</Title>
          <SimpleGrid cols={2} spacing="md">
            {item.photos.map(photo => (
              <Image key={photo} src={photo} alt={item.name} radius="sm" />
            ))}
          </SimpleGrid>
        </Paper>
      </SimpleGrid>
    </div>
  );
};

export default ItemDetailPage;
