// src/pages/buildings/BuildingsPage.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Spinner from '../../components/Spinner';
import Button from '../../components/Button';
import AddBuildingModal from './AddBuildingModal';
import EditBuildingModal from './EditBuildingModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import EmptyState from '../../components/EmptyState';
import Table from '../../components/Table';
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import type { Estate } from '../estates/EstatesPage';
import { FaPlus, FaPencilAlt, FaTrash } from 'react-icons/fa';

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

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Code', accessor: 'code' },
    { header: 'Estate', accessor: 'estateName' },
    { header: 'Type', accessor: 'building_type' },
  ];

  const tableData = buildings.map(b => ({ ...b, estateName: b.estates.name }));

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
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center">
          <FaPlus className="mr-2" />
          Add Building
        </Button>
      </div>

      {buildings.length === 0 ? (
        <EmptyState
          title="No Buildings Found"
          message="Get started by adding your first building to the system."
          actionText="Add Your First Building"
          onActionClick={() => setIsAddModalOpen(true)}
        />
      ) : (
        <Table
          columns={columns}
          data={tableData}
          renderActions={(building) => (
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedBuilding(building);
                  setIsEditModalOpen(true);
                }}
                className="flex items-center"
              >
                <FaPencilAlt />
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setSelectedBuilding(building);
                  setIsDeleteModalOpen(true);
                }}
                className="flex items-center"
              >
                <FaTrash />
              </Button>
            </div>
          )}
        />
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
