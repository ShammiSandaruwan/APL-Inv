// src/pages/buildings/BuildingsPage.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Spinner from '../../components/Spinner';
import Button from '../../components/Button';
import Card from '../../components/Card';
import AddBuildingModal from './AddBuildingModal';
import EditBuildingModal from './EditBuildingModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import { Estate } from '../estates/EstatesPage';

// Define the type for a building object
export interface Building {
  id: string;
  name: string;
  code: string;
  estate_id: string;
  building_type: string;
  estates: Estate;
}

const BuildingsPage: React.FC = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  useEffect(() => {
    const fetchBuildings = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('buildings')
        .select('*, estates(*)');

      if (error) {
        showErrorToast(error.message);
      } else {
        setBuildings(data as Building[]);
      }
      setIsLoading(false);
    };

    fetchBuildings();
  }, []);

  const handleAddBuilding = async (building: Omit<Building, 'id' | 'estates'>) => {
    const { data, error } = await supabase
      .from('buildings')
      .insert([building])
      .select('*, estates(*)')
      .single();

    if (error) {
      showErrorToast(error.message);
    } else if (data) {
      setBuildings([...buildings, data as Building]);
      showSuccessToast('Building added successfully!');
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteBuilding = async () => {
    if (!selectedBuilding) return;

    const { error } = await supabase
      .from('buildings')
      .delete()
      .eq('id', selectedBuilding.id);

    if (error) {
      showErrorToast(error.message);
    } else {
      setBuildings(buildings.filter((b) => b.id !== selectedBuilding.id));
      showSuccessToast('Building deleted successfully!');
      setIsDeleteModalOpen(false);
      setSelectedBuilding(null);
    }
  };

  const handleUpdateBuilding = async (updatedBuilding: Building) => {
    const { data, error } = await supabase
      .from('buildings')
      .update({
        name: updatedBuilding.name,
        code: updatedBuilding.code,
        estate_id: updatedBuilding.estate_id,
        building_type: updatedBuilding.building_type,
      })
      .eq('id', updatedBuilding.id)
      .select('*, estates(*)')
      .single();

    if (error) {
      showErrorToast(error.message);
    } else if (data) {
      setBuildings(
        buildings.map((b) => (b.id === updatedBuilding.id ? (data as Building) : b))
      );
      showSuccessToast('Building updated successfully!');
      setIsEditModalOpen(false);
      setSelectedBuilding(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-mine-shaft">Buildings Management</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>Add Building</Button>
      </div>

      {buildings.length === 0 ? (
        <p>No buildings found. Add one to get started.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buildings.map((building) => (
            <Card key={building.id}>
              <h2 className="text-xl font-semibold">{building.name}</h2>
              <p className="text-scorpion">Code: {building.code}</p>
              <p className="text-scorpion">Estate: {building.estates.name}</p>
              <p className="text-scorpion">Type: {building.building_type}</p>
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedBuilding(building);
                    setIsEditModalOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setSelectedBuilding(building);
                    setIsDeleteModalOpen(true);
                  }}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AddBuildingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddBuilding={handleAddBuilding}
      />

      <EditBuildingModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdateBuilding={handleUpdateBuilding}
        building={selectedBuilding}
      />

      {selectedBuilding && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteBuilding}
          title="Delete Building"
          message={`Are you sure you want to delete the building "${selectedBuilding.name}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default BuildingsPage;
