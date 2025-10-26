// src/pages/items/ItemsPage.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Spinner from '../../components/Spinner';
import Button from '../../components/Button';
import Card from '../../components/Card';
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import { FaPlus, FaPencilAlt, FaTrash } from 'react-icons/fa';

// Define the type for an item object
export interface Item {
  id: string;
  name: string;
  item_code: string;
  building_id: string;
  buildings: {
    id: string;
    name: string;
    estates: {
      id: string;
      name: string;
    }
  }
}

const ItemsPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

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

  const handleAddItem = async (item: Omit<Item, 'id' | 'buildings'>) => {
    const { data, error } = await supabase
      .from('items')
      .insert([item])
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
        building_id: updatedItem.building_id,
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
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center">
          <FaPlus className="mr-2" />
          Add Item
        </Button>
      </div>

      {items.length === 0 ? (
        <p>No items found. Add one to get started.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id}>
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p className="text-scorpion">Code: {item.item_code}</p>
              <p className="text-scorpion">Building: {item.buildings.name}</p>
              <p className="text-scorpion">Estate: {item.buildings.estates.name}</p>
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedItem(item);
                    setIsEditModalOpen(true);
                  }}
                  className="flex items-center"
                >
                  <FaPencilAlt className="mr-2" />
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setSelectedItem(item);
                    setIsDeleteModalOpen(true);
                  }}
                  className="flex items-center"
                >
                  <FaTrash className="mr-2" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
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
    </div>
  );
};

export default ItemsPage;
