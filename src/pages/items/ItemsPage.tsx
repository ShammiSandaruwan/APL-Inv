// src/pages/items/ItemsPage.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Spinner from '../../components/Spinner';
import Button from '../../components/Button';
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import EmptyState from '../../components/EmptyState';
import Table from '../../components/Table';
import Input from '../../components/Input';
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import { FaPlus, FaPencilAlt, FaTrash, FaEye } from 'react-icons/fa';
import type { Item } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const ItemsPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [estateFilter, setEstateFilter] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const { profile, permissions } = useAuth();

  const canCreate = profile?.role === 'super_admin' || profile?.role === 'estate_user' || permissions?.can_create_items;
  const canEdit = profile?.role === 'super_admin' || profile?.role === 'estate_user' || permissions?.can_edit_items;
  const canDelete = profile?.role === 'super_admin' || profile?.role === 'estate_user' || permissions?.can_delete_items;

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('items')
        .select('*, buildings(*, estates(*))');

      if (error) {
        showErrorToast(error.message);
      } else {
        setItems(data as Item[]);
      }
      setIsLoading(false);
    };

    fetchItems();
  }, []);

  const handleAddItem = async (item: Omit<Item, 'id' | 'buildings' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('items')
      .insert(item)
      .select('*, buildings(*, estates(*))')
      .single();

    if (error) {
      showErrorToast(error.message);
    } else if (data) {
      setItems([...items, data as Item]);
      showSuccessToast('Item added successfully!');
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;

    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', selectedItem.id);

    if (error) {
      showErrorToast(error.message);
    } else {
      setItems(items.filter((i) => i.id !== selectedItem.id));
      showSuccessToast('Item deleted successfully!');
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    }
  };

  const handleUpdateItem = async (updatedItem: Item) => {
    const { data, error } = await supabase
      .from('items')
      .update({
        name: updatedItem.name,
        item_code: updatedItem.item_code,
        estate_id: updatedItem.estate_id,
        building_id: updatedItem.building_id,
        photos: updatedItem.photos,
      })
      .eq('id', updatedItem.id)
      .select('*, buildings(*, estates(*))')
      .single();

    if (error) {
      showErrorToast(error.message);
    } else if (data) {
      setItems(
        items.map((i) => (i.id === updatedItem.id ? (data as Item) : i))
      );
      showSuccessToast('Item updated successfully!');
      setIsEditModalOpen(false);
      setSelectedItem(null);
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Code', accessor: 'item_code' },
    { header: 'Building', accessor: 'buildingName' },
    { header: 'Estate', accessor: 'estateName' },
  ];

  const filteredAndSortedItems = useMemo(() => {
    return items
      .filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (estateFilter === '' || item.buildings?.estates?.id === parseInt(estateFilter, 10)) &&
        (buildingFilter === '' || item.building_id === parseInt(buildingFilter, 10))
      )
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        } else if (sortBy === 'date') {
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        }
        return 0;
      });
  }, [items, searchTerm, estateFilter, buildingFilter, sortBy]);

  const uniqueEstates = [...new Map(items.map(i => [i.buildings?.estates?.id, i.buildings?.estates])).values()];
  const uniqueBuildings = [...new Map(items.map(i => [i.buildings?.id, i.buildings])).values()];

  const tableData = filteredAndSortedItems.map(i => ({
    ...i,
    buildingName: i.buildings?.name,
    estateName: i.buildings?.estates?.name,
  }));

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
        <h1 className="text-2xl font-bold text-mine-shaft">Items Management</h1>
        {canCreate && (
          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center">
            <FaPlus className="mr-2" />
            Add Item
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
          value={buildingFilter}
          onChange={(e) => setBuildingFilter(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-silver-chalice rounded-md text-sm shadow-sm placeholder-scorpion focus:outline-none focus:ring-bay-leaf focus:border-bay-leaf"
        >
          <option value="">All Buildings</option>
          {uniqueBuildings.map(building => building && (
            <option key={building.id} value={building.id}>{building.name}</option>
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

      {filteredAndSortedItems.length === 0 ? (
        <EmptyState
          title="No Items Found"
          message="Get started by adding your first item to the system."
          actionText="Add Your First Item"
          onActionClick={() => setIsAddModalOpen(true)}
        />
      ) : (
        <Table
          columns={columns}
          data={tableData}
          renderActions={(item) => (
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(`/items/${item.id}`)}
                className="flex items-center"
              >
                <FaEye />
              </Button>
              {canEdit && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedItem(item);
                    setIsEditModalOpen(true);
                  }}
                  className="flex items-center"
                >
                  <FaPencilAlt />
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setSelectedItem(item);
                    setIsDeleteModalOpen(true);
                  }}
                  className="flex items-center"
                >
                  <FaTrash />
                </Button>
              )}
            </div>
          )}
        />
      )}

      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddItem={handleAddItem}
      />

      <EditItemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdateItem={handleUpdateItem}
        item={selectedItem}
      />

      {selectedItem && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteItem}
          title="Delete Item"
          message={`Are you sure you want to delete the item "${selectedItem.name}"? This action cannot be undone.`}
        />
      )}

      {selectedItem && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteItem}
          title="Delete Item"
          message={`Are you sure you want to delete the item "${selectedItem.name}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default ItemsPage;
