// src/pages/items/EditItemModal.tsx
import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';
import type { Item } from './ItemsPage';
import type { Estate } from '../estates/EstatesPage';
import type { Building } from '../buildings/BuildingsPage';
import { supabase } from '../../lib/supabaseClient';
import { showErrorToast } from '../../utils/toast';

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateItem: (item: Item) => void;
  item: Item | null;
}

const EditItemModal: React.FC<EditItemModalProps> = ({ isOpen, onClose, onUpdateItem, item }) => {
  const [name, setName] = useState('');
  const [itemCode, setItemCode] = useState('');
  const [estateId, setEstateId] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [estates, setEstates] = useState<Estate[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);

  useEffect(() => {
    const fetchEstates = async () => {
      const { data, error } = await supabase.from('estates').select('*');
      if (error) {
        showErrorToast(error.message);
      } else {
        setEstates(data as Estate[]);
      }
    };

    if (isOpen) {
      fetchEstates();
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchBuildings = async () => {
      if (estateId) {
        const { data, error } = await supabase
          .from('buildings')
          .select('*')
          .eq('estate_id', estateId);
        if (error) {
          showErrorToast(error.message);
        } else {
          setBuildings(data as Building[]);
        }
      }
    };

    fetchBuildings();
  }, [estateId]);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setItemCode(item.item_code);
      setEstateId(item.buildings.estates.id);
      setBuildingId(item.building_id);
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (item) {
      onUpdateItem({ ...item, name, item_code: itemCode, building_id: buildingId });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Item">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Item Name"
          id="name"
          name="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Item Code"
          id="itemCode"
          name="itemCode"
          type="text"
          required
          value={itemCode}
          onChange={(e) => setItemCode(e.target.value)}
        />
        <div>
          <label htmlFor="estate" className="block text-sm font-medium text-mine-shaft">
            Estate
          </label>
          <select
            id="estate"
            name="estate"
            required
            value={estateId}
            onChange={(e) => {
              setEstateId(e.target.value);
              setBuildingId('');
            }}
            className="mt-1 block w-full px-3 py-2 bg-white border border-silver-chalice rounded-md text-sm shadow-sm placeholder-scorpion focus:outline-none focus:ring-bay-leaf focus:border-bay-leaf"
          >
            <option value="" disabled>Select an estate</option>
            {estates.map((estate) => (
              <option key={estate.id} value={estate.id}>
                {estate.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="building" className="block text-sm font-medium text-mine-shaft">
            Building
          </label>
          <select
            id="building"
            name="building"
            required
            value={buildingId}
            onChange={(e) => setBuildingId(e.target.value)}
            disabled={!estateId}
            className="mt-1 block w-full px-3 py-2 bg-white border border-silver-chalice rounded-md text-sm shadow-sm placeholder-scorpion focus:outline-none focus:ring-bay-leaf focus:border-bay-leaf"
          >
            <option value="" disabled>Select a building</option>
            {buildings.map((building) => (
              <option key={building.id} value={building.id}>
                {building.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditItemModal;
