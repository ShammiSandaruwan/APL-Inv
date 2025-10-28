// src/pages/buildings/OccupancyModal.tsx
import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { supabase } from '../../lib/supabaseClient';
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import type { Building } from '../../types';

interface OccupancyModalProps {
  isOpen: boolean;
  onClose: () => void;
  building: Building | null;
  onUpdate: () => void;
}

const OccupancyModal: React.FC<OccupancyModalProps> = ({ isOpen, onClose, building, onUpdate }) => {
  const [occupiedBy, setOccupiedBy] = useState('');
  const [occupantDesignation, setOccupantDesignation] = useState('');
  const [occupancyStartDate, setOccupancyStartDate] = useState('');

  useEffect(() => {
    if (building) {
      setOccupiedBy(building.occupied_by || '');
      setOccupantDesignation(building.occupant_designation || '');
      setOccupancyStartDate(building.occupancy_start_date || '');
    }
  }, [building]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (building) {
      const { error } = await supabase
        .from('buildings')
        .update({
          occupied_by: occupiedBy,
          occupant_designation: occupantDesignation,
          occupancy_start_date: occupancyStartDate,
        })
        .eq('id', building.id);

      if (error) {
        showErrorToast(error.message);
      } else {
        showSuccessToast('Occupancy updated successfully!');
        onUpdate();
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Occupancy for ${building?.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Occupied By"
          id="occupiedBy"
          name="occupiedBy"
          type="text"
          value={occupiedBy}
          onChange={(e) => setOccupiedBy(e.target.value)}
        />
        <Input
          label="Occupant Designation"
          id="occupantDesignation"
          name="occupantDesignation"
          type="text"
          value={occupantDesignation}
          onChange={(e) => setOccupantDesignation(e.target.value)}
        />
        <Input
          label="Occupancy Start Date"
          id="occupancyStartDate"
          name="occupancyStartDate"
          type="date"
          value={occupancyStartDate}
          onChange={(e) => setOccupancyStartDate(e.target.value)}
        />
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

export default OccupancyModal;
