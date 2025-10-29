// src/pages/items/ItemsPage.tsx
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
} from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../components/ConfirmationModal';
import EmptyState from '../../components/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabaseClient';
import type { Building, Estate, Item } from '../../types';
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';

const ItemsPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [estates, setEstates] = useState<Estate[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [estateFilter, setEstateFilter] = useState<string | null>(null);
  const [buildingFilter, setBuildingFilter] = useState<string | null>(null);
  const navigate = useNavigate();
  const { profile, permissions } = useAuth();

  const canCreate =
    profile?.role === 'super_admin' ||
    profile?.role === 'estate_user' ||
    permissions?.can_create_items;
  const canEdit =
    profile?.role === 'super_admin' ||
    profile?.role === 'estate_user' ||
    permissions?.can_edit_items;
  const canDelete =
    profile?.role === 'super_admin' ||
    profile?.role === 'estate_user' ||
    permissions?.can_delete_items;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data: itemsData, error: itemsError } = await supabase
          .from('items')
          .select('*, buildings(*, estates(*))');
        if (itemsError) throw itemsError;
        setItems(itemsData as Item[]);

        const { data: estatesData, error: estatesError } = await supabase
          .from('estates')
          .select('*');
        if (estatesError) throw estatesError;
        setEstates(estatesData as Estate[]);

        const { data: buildingsData, error: buildingsError } = await supabase
          .from('buildings')
          .select('*');
        if (buildingsError) throw buildingsError;
        setBuildings(buildingsData as Building[]);
      } catch (error: any) {
        showErrorToast(error.message || 'Failed to fetch page data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddItem = (newItem: Item) => {
    setItems((prevItems) => [...prevItems, newItem]);
    setIsAddModalOpen(false);
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;
    const { error } = await supabase.from('items').delete().eq('id', selectedItem.id);
    if (error) {
      showErrorToast(error.message);
    } else {
      setItems(items.filter((i) => i.id !== selectedItem.id));
      showSuccessToast('Item deleted successfully!');
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    }
  };

  const handleUpdateItem = (updatedItem: Item) => {
    setItems(items.map((i) => (i.id === updatedItem.id ? updatedItem : i)));
    setIsEditModalOpen(false);
    setSelectedItem(null);
  };

  const filteredItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!estateFilter || item.buildings?.estate_id === estateFilter) &&
        (!buildingFilter || item.building_id === buildingFilter)
    );
  }, [items, searchTerm, estateFilter, buildingFilter]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Items Management</Title>
        {canCreate && (
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Item
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
          placeholder="Filter by building"
          data={buildings.map((b) => ({ value: b.id, label: b.name }))}
          value={buildingFilter}
          onChange={setBuildingFilter}
          clearable
        />
      </Group>

      {filteredItems.length === 0 ? (
        <EmptyState
          title="No Items Found"
          message="Get started by adding your first item to the system."
          actionText={canCreate ? 'Add Your First Item' : undefined}
          onActionClick={canCreate ? () => setIsAddModalOpen(true) : undefined}
        />
      ) : (
        <DataTable
          withTableBorder
          borderRadius="sm"
          withColumnBorders
          striped
          highlightOnHover
          records={filteredItems}
          columns={[
            { accessor: 'name', title: 'Name', sortable: true },
            { accessor: 'item_code', title: 'Code', sortable: true },
            {
              accessor: 'buildings.name',
              title: 'Building',
              render: ({ buildings }: Item) => buildings?.name || 'N/A',
              sortable: true,
            },
            {
              accessor: 'buildings.estates.name',
              title: 'Estate',
              render: ({ buildings }: Item) => buildings?.estates?.name || 'N/A',
              sortable: true,
            },
            {
              accessor: 'actions',
              title: 'Actions',
              textAlign: 'right',
              render: (item: Item) => (
                <Group gap="xs" justify="flex-end">
                  <Tooltip label="View Details">
                    <ActionIcon
                      variant="subtle"
                      onClick={() => navigate(`/items/${item.id}`)}
                    >
                      <IconEye size={16} />
                    </ActionIcon>
                  </Tooltip>
                  {canEdit && (
                    <Tooltip label="Edit Item">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <IconPencil size={16} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                  {canDelete && (
                    <Tooltip label="Delete Item">
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </Group>
              ),
            },
          ]}
        />
      )}

      {canCreate && (
        <AddItemModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddItem={handleAddItem}
        />
      )}

      {canEdit && (
        <EditItemModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdateItem={handleUpdateItem}
          item={selectedItem}
        />
      )}

      {canDelete && selectedItem && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteItem}
          title="Delete Item"
          message={`Are you sure you want to delete "${selectedItem.name}"? This action cannot be undone.`}
        />
      )}
    </Stack>
  );
};

export default ItemsPage;
