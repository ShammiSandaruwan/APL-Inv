// src/pages/estates/EstatesPage.tsx
import {
  ActionIcon,
  Badge,
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
} from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../components/ConfirmationModal';
import EmptyState from '../../components/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabaseClient';
import type { Estate } from '../../types';
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import AddEstateModal from './AddEstateModal';
import EditEstateModal from './EditEstateModal';

const EstatesPage: React.FC = () => {
  const [estates, setEstates] = useState<Estate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEstate, setSelectedEstate] = useState<Estate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const navigate = useNavigate();
  const { profile, permissions } = useAuth();

  const canManage =
    profile?.role === 'super_admin' ||
    (profile?.role === 'co_admin' && permissions?.can_manage_estates);

  useEffect(() => {
    let isMounted = true;
    const fetchEstates = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from('estates').select('*');
        if (error) throw error;
        if (isMounted) {
          setEstates(data as Estate[]);
        }
      } catch (error: any) {
        showErrorToast(error.message || 'Failed to fetch estates.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    fetchEstates();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddEstate = (newEstate: Estate) => {
    setEstates([...estates, newEstate]);
    setIsAddModalOpen(false);
  };

  const handleDeleteEstate = async () => {
    if (!selectedEstate) return;
    const { error } = await supabase
      .from('estates')
      .delete()
      .eq('id', selectedEstate.id);
    if (error) {
      showErrorToast(error.message);
    } else {
      setEstates(estates.filter((e) => e.id !== selectedEstate.id));
      showSuccessToast('Estate deleted successfully!');
      setIsDeleteModalOpen(false);
      setSelectedEstate(null);
    }
  };

  const handleUpdateEstate = (updatedEstate: Estate) => {
    setEstates(
      estates.map((e) => (e.id === updatedEstate.id ? updatedEstate : e))
    );
    setIsEditModalOpen(false);
    setSelectedEstate(null);
  };

  const filteredEstates = useMemo(() => {
    return estates.filter(
      (estate) =>
        estate.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!locationFilter || estate.location === locationFilter)
    );
  }, [estates, searchTerm, locationFilter]);

  const uniqueLocations = [...new Set(estates.map((e) => e.location))];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Estates Management</Title>
        {canManage && (
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Estate
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
          placeholder="Filter by location"
          data={uniqueLocations.map((loc) => ({ value: loc, label: loc }))}
          value={locationFilter}
          onChange={setLocationFilter}
          clearable
        />
      </Group>

      {filteredEstates.length === 0 ? (
        <EmptyState
          title="No Estates Found"
          message="Get started by adding your first estate to the system."
          actionText={canManage ? 'Add Your First Estate' : undefined}
          onActionClick={canManage ? () => setIsAddModalOpen(true) : undefined}
        />
      ) : (
        <DataTable
          withTableBorder
          borderRadius="sm"
          withColumnBorders
          striped
          highlightOnHover
          records={filteredEstates}
          columns={[
            { accessor: 'name', title: 'Name', sortable: true },
            { accessor: 'code', title: 'Code', sortable: true },
            { accessor: 'location', title: 'Location', sortable: true },
            {
              accessor: 'is_active',
              title: 'Status',
              render: ({ is_active }: Estate) => (
                <Badge color={is_active ? 'green' : 'gray'}>
                  {is_active ? 'Active' : 'Inactive'}
                </Badge>
              ),
              sortable: true
            },
            {
              accessor: 'actions',
              title: 'Actions',
              textAlign: 'right',
              render: (estate: Estate) => (
                <Group gap="xs" justify="flex-end">
                  <Tooltip label="View Details">
                    <ActionIcon
                      variant="subtle"
                      onClick={() => navigate(`/estates/${estate.id}`)}
                    >
                      <IconEye size={16} />
                    </ActionIcon>
                  </Tooltip>
                  {canManage && (
                    <>
                      <Tooltip label="Edit Estate">
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          onClick={() => {
                            setSelectedEstate(estate);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <IconPencil size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Delete Estate">
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => {
                            setSelectedEstate(estate);
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
          <AddEstateModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAddEstate={handleAddEstate}
          />
          <EditEstateModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onUpdateEstate={handleUpdateEstate}
            estate={selectedEstate}
          />
          {selectedEstate && (
            <ConfirmationModal
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={handleDeleteEstate}
              title="Delete Estate"
              message={`Are you sure you want to delete "${selectedEstate.name}"? This action cannot be undone.`}
            />
          )}
        </>
      )}
    </Stack>
  );
};

export default EstatesPage;
