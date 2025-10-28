// src/pages/items/ItemDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import Spinner from '../../components/Spinner';
import { showErrorToast } from '../../utils/toast';
import type { Item } from '../../types';

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
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  if (!item) {
    return <p>Item not found.</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{item.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Details</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p><strong>Code:</strong> {item.item_code}</p>
            <p><strong>Estate:</strong> {item.buildings?.estates?.name}</p>
            <p><strong>Building:</strong> {item.buildings?.name}</p>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Photos</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-2 gap-4">
              {item.photos.map(photo => (
                <img key={photo} src={photo} alt={item.name} className="w-full h-auto rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;
