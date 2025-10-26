// src/pages/buildings/EditBuildingModal.tsx
import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Building } from './BuildingsPage';
import { Estate } from '../estates/EstatesPage';
import { supabase } from '../../lib/supabaseClient';
import { showErrorToast } from '../../utils/toast';

interface EditBuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateBuilding: (building: Building) => void;
  building: Building | null;
}

const EditBuildingModal: React.FC<EditBuildingModalProps> = ({ isOpen, onClose, onUpdateBuilding, building }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [estateId, setEstateId] = useState('');
  const [buildingType, setBuildingType] = useState('');
  const [estates, setEstates] = useState<Estate[]>([]);

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
    if (building) {
      setName(building.name);
      setCode(building.code);
      setEstateId(building.estate_id);
      setBuildingType(building.building_type);
    }
  }, [building]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (building) {
      onUpdateBuilding({ ...building, name, code, estate_id: estateId, building_type: buildingType });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Building">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Building Name"
          id="name"
          name="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Building Code"
          id="code"
          name="code"
          type="text"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
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
            onChange={(e) => setEstateId(e.target.value)}
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
          <label htmlFor="buildingType" className="block text-sm font-medium text-mine-shaft">
            Building Type
          </label>
          <select
            id="buildingType"
            name="buildingType"
            required
            value={buildingType}
            onChange={(e) => setBuildingType(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-silver-chalice rounded-md text-sm shadow-sm placeholder-scorpion focus:outline-none focus:ring-bay-leaf focus:border-bay-leaf"
          >
            <option value="" disabled>Select a type</option>
            <option value="Factory">Factory</option>
            <option value="Bungalow">Bungalow</option>
            <option value="Staff Quarters">Staff Quarters</option>
            <option value="Warehouse">Warehouse</option>
            <option value="Office">Office</option>
            <option value="Other">Other</option>
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

export default EditBuildingModal;
