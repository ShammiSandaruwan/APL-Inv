// src/pages/buildings/BuildingDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import Spinner from '../../components/Spinner';
import { showErrorToast } from '../../utils/toast';
import type { Building } from '../../types';
import type { Item } from '../../types';

const BuildingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [building, setBuilding] = useState<Building | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
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
      } else if (isMounted) {
        setBuilding(buildingData as Building);
      }

      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('*')
        .eq('building_id', id);

      if (itemsError) {
        showErrorToast(itemsError.message);
      } else if (isMounted) {
        setItems(itemsData as Item[]);
      }

      if (isMounted) setIsLoading(false);
    };

    fetchBuildingDetails();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  if (!building) {
    return <p>Building not found.</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{building.name}</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Details</h2>
        <p><strong>Code:</strong> {building.code}</p>
        <p><strong>Estate:</strong> {building.estates?.name}</p>
        <p><strong>Type:</strong> {building.building_type}</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Items in this Building</h2>
      {items.length === 0 ? (
        <p>No items found in this building.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold">{item.name}</h3>
              <p><strong>Code:</strong> {item.item_code}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuildingDetailPage;
