// src/pages/estates/EstateDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import Spinner from '../../components/Spinner';
import { showErrorToast } from '../../utils/toast';
import type { Estate } from './EstatesPage';
import type { Building } from '../../types';

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
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  if (!estate) {
    return <p>Estate not found.</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{estate.name}</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Details</h2>
        <p><strong>Code:</strong> {estate.code}</p>
        <p><strong>Location:</strong> {estate.location}</p>
        <p><strong>Description:</strong> {estate.description}</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Buildings in this Estate</h2>
      {buildings.length === 0 ? (
        <p>No buildings found in this estate.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buildings.map(building => (
            <div key={building.id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold">{building.name}</h3>
              <p><strong>Code:</strong> {building.code}</p>
              <p><strong>Type:</strong> {building.building_type}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EstateDetailPage;
