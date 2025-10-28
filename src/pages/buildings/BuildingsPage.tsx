// src/pages/buildings/BuildingsPage.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import Spinner from '../../components/Spinner';
import Button from '../../components/Button';
import AddBuildingModal from './AddBuildingModal';
import EditBuildingModal from './EditBuildingModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import OccupancyModal from './OccupancyModal';
import EmptyState from '../../components/EmptyState';
import Table from '../../components/Table';
import Input from '../../components/Input';
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import { FaPlus, FaPencilAlt, FaTrash, FaEye, FaUser } from 'react-icons/fa';
import type { Building } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const BuildingsPage: React.FC = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isOccupancyModalOpen, setIsOccupancyModalOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [estateFilter, setEstateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const navigate = useNavigate();
  const { profile, permissions } = useAuth();

  const canManage = profile?.role === 'super_admin' || (profile?.role === 'co_admin' && permissions?.can_manage_buildings);

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
    { header: 'Occupied By', accessor: 'occupied_by' },
  ];

  const filteredAndSortedBuildings = useMemo(() => {
    return buildings
      .filter(building =>
        building.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (estateFilter === '' || building.estate_id === parseInt(estateFilter, 10)) &&
        (typeFilter === '' || building.building_type === typeFilter)
      )
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        } else if (sortBy === 'date') {
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        }
        return 0;
      });
  }, [buildings, searchTerm, estateFilter, typeFilter, sortBy]);

  const uniqueEstates = [...new Map(buildings.map(b => [b.estates?.id, b.estates])).values()];
  const uniqueTypes = [...new Set(buildings.map(b => b.building_type))];

  const tableData = filteredAndSortedBuildings.map(b => ({ ...b, estateName: b.estates?.name }));

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
        {canManage && (
          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center">
            <FaPlus className="mr-2" />
            Add Building
          </Button>
        )}
      </div>

      <div className="mb-4 flex space-x-4">
        <Input
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={estateFilter}
          onChange={(e) => setEstateFilter(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-silver-chalice rounded-md text-sm shadow-sm placeholder-scorpion focus:outline-none focus:ring-bay-leaf focus:border-bay-leaf"
        >
          <option value="">All Estates</option>
          {uniqueEstates.map(estate => estate && (
            <option key={estate.id} value={estate.id}>{estate.name}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-silver-chalice rounded-md text-sm shadow-sm placeholder-scorpion focus:outline-none focus:ring-bay-leaf focus:border-bay-leaf"
        >
          <option value="">All Types</option>
          {uniqueTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-silver-chalice rounded-md text-sm shadow-sm placeholder-scorpion focus:outline-none focus:ring-bay-leaf focus:border-bay-leaf"
        >
          <option value="name">Sort by Name</option>
          <option value="date">Sort by Date</option>
        </select>
      </div>

      {filteredAndSortedBuildings.length === 0 ? (
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
                onClick={() => navigate(`/buildings/${building.id}`)}
                className="flex items-center"
              >
                <FaEye />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedBuilding(building);
                  setIsOccupancyModalOpen(true);
                }}
                className="flex items-center"
              >
                <FaUser />
              </Button>
              {canManage && (
                <>
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
                </>
              )}
            </div>
          )}
        />
      )}

      <AddBuildingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddBuilding={handleAddBuilding}
      />

      <OccupancyModal
        isOpen={isOccupancyModalOpen}
        onClose={() => setIsOccupancyModalOpen(false)}
        building={selectedBuilding}
        onUpdate={(updatedBuilding) => {
          setBuildings(buildings.map((b) => (b.id === updatedBuilding.id ? updatedBuilding : b)));
          setIsOccupancyModalOpen(false);
        }}
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
