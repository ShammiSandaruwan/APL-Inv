// src/pages/buildings/BuildingsPage.tsx
import {
  ActionIcon,
  Button,
  Group,
  Loader,
  Select,
  Stack,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  IconEye,
  IconPencil,
  IconPlus,
  IconSearch,
  IconTrash,
  IconUser,
} from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../components/ConfirmationModal';
import EmptyState from '../../components/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabaseClient';
import type { Building, Estate } from '../../types';
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import AddBuildingModal from './AddBuildingModal';
import EditBuildingModal from './EditBuildingModal';
import OccupancyModal from './OccupancyModal';

const BuildingsPage: React.FC = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [estates, setEstates] = useState<Estate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isOccupancyModalOpen, setIsOccupancyModalOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [estateFilter, setEstateFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const navigate = useNavigate();
  const { profile, permissions } = useAuth();

  const canManage =
    profile?.role === 'super_admin' ||
    (profile?.role === 'co_admin' && permissions?.can_manage_buildings);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data: buildingsData, error: buildingsError } = await supabase
          .from('buildings')
          .select('*, estates(*)');
        if (buildingsError) throw buildingsError;
        setBuildings(buildingsData as Building[]);

        const { data: estatesData, error: estatesError } = await supabase
          .from('estates')
          .select('*');
        if (estatesError) throw estatesError;
        setEstates(estatesData as Estate[]);
      } catch (error: any) {
        showErrorToast(error.message || 'Failed to fetch data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddBuilding = (newBuilding: Building) => {
    setBuildings((prev) => [...prev, newBuilding]);
    setIsAddModalOpen(false);
  };

  const handleDeleteBuilding = async () => {
    if (!selectedBuilding) return;
    const { error } = await supabase.from('buildings').delete().eq('id', selectedBuilding.id);
    if (error) {
      showErrorToast(error.message);
    } else {
      setBuildings(buildings.filter((b) => b.id !== selectedBuilding.id));
      showSuccessToast('Building deleted successfully!');
      setIsDeleteModalOpen(false);
      setSelectedBuilding(null);
    }
  };

  const handleUpdateBuilding = (updatedBuilding: Building) => {
    setBuildings(
      buildings.map((b) =>
        b.id === updatedBuilding.id ? updatedBuilding : b
      )
    );
    setIsEditModalOpen(false);
    setSelectedBuilding(null);
  };

  const filteredBuildings = useMemo(() => {
    return buildings.filter(
      (building) =>
        building.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!estateFilter || building.estate_id === estateFilter) &&
        (!typeFilter || building.building_type === typeFilter)
    );
  }, [buildings, searchTerm, estateFilter, typeFilter]);

  const uniqueTypes = [...new Set(buildings.map((b) => b.building_type))];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Buildings Management</Title>
        {canManage && (
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Building
          </Button>
        )}
      </Group>

      <Group grow>
        <TextInput
          placeholder="Search by name..."
          leftSection={<IconSearch size={16} />}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.currentTarget.value)}
        />
        <Select
          placeholder="Filter by estate"
          data={estates.map((e) => ({ value: e.id, label: e.name }))}
          value={estateFilter}
          onChange={setEstateFilter}
          clearable
        />
        <Select
          placeholder="Filter by type"
          data={uniqueTypes.map((t) => ({ value: t, label: t }))}
          value={typeFilter}
          onChange={setTypeFilter}
          clearable
        />
      </Group>

      {filteredBuildings.length === 0 ? (
        <EmptyState
          title="No Buildings Found"
          message="Get started by adding your first building."
          actionText={canManage ? 'Add Your First Building' : undefined}
          onActionClick={canManage ? () => setIsAddModalOpen(true) : undefined}
        />
      ) : (
        <DataTable
          withTableBorder
          borderRadius="sm"
          withColumnBorders
          striped
          highlightOnHover
          records={filteredBuildings}
          columns={[
            { accessor: 'name', title: 'Name', sortable: true },
            { accessor: 'code', title: 'Code', sortable: true },
            {
              accessor: 'estates.name',
              title: 'Estate',
              render: ({ estates }: Building) => estates?.name || 'N/A',
              sortable: true
            },
            { accessor: 'building_type', title: 'Type', sortable: true },
            { accessor: 'occupied_by', title: 'Occupied By', sortable: true },
            {
              accessor: 'actions',
              title: 'Actions',
              textAlign: 'right',
              render: (building: Building) => (
                <Group gap="xs" justify="flex-end">
                  <Tooltip label="View Details">
                    <ActionIcon
                      variant="subtle"
                      onClick={() => navigate(`/buildings/${building.id}`)}
                    >
                      <IconEye size={16} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Update Occupancy">
                    <ActionIcon
                      variant="subtle"
                      onClick={() => {
                        setSelectedBuilding(building);
                        setIsOccupancyModalOpen(true);
                      }}
                    >
                      <IconUser size={16} />
                    </ActionIcon>
                  </Tooltip>
                  {canManage && (
                    <>
                      <Tooltip label="Edit Building">
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          onClick={() => {
                            setSelectedBuilding(building);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <IconPencil size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Delete Building">
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => {
                            setSelectedBuilding(building);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </>
                  )}
                </Group>
              ),
            },
          ]}
        />
      )}

      {canManage && (
        <>
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
              message={`Are you sure you want to delete "${selectedBuilding.name}"? This action is irreversible.`}
            />
          )}
        </>
      )}

      <OccupancyModal
        isOpen={isOccupancyModalOpen}
        onClose={() => setIsOccupancyModalOpen(false)}
        building={selectedBuilding}
        onUpdate={(updatedBuilding) => {
          setBuildings(
            buildings.map((b) =>
              b.id === updatedBuilding.id ? updatedBuilding : b
            )
          );
          setIsOccupancyModalOpen(false);
        }}
      />
    </Stack>
  );
};

export default BuildingsPage;
