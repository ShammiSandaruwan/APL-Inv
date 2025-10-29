// src/pages/buildings/AddBuildingModal.tsx
import { Modal, TextInput, Button, Select, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { Estate } from '../../types';

interface AddBuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBuilding: (building: any) => void;
}

const AddBuildingModal: React.FC<AddBuildingModalProps> = ({ isOpen, onClose, onAddBuilding }) => {
  const [estates, setEstates] = useState<Estate[]>([]);

  const form = useForm({
    initialValues: {
      name: '',
      code: '',
      estate_id: '',
      building_type: '',
    },
  });

  useEffect(() => {
    // Fetch estates for the dropdown
    const fetchEstates = async () => {
      const { data } = await supabase.from('estates').select('*');
      setEstates(data || []);
    };
    fetchEstates();
  }, []);

  const handleSubmit = () => {
    onAddBuilding(form.values);
    form.reset();
    onClose();
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Add New Building">
      <TextInput label="Building Name" {...form.getInputProps('name')} mb="sm" />
      <TextInput label="Building Code" {...form.getInputProps('code')} mb="sm" />
      <Select
        label="Estate"
        placeholder="Select estate"
        data={estates.map(e => ({ value: e.id || '', label: e.name }))}
        {...form.getInputProps('estate_id')}
        mb="sm"
      />
      <Select
        label="Building Type"
        placeholder="Select type"
        data={['Factory', 'Bungalow', 'Staff Quarters']}
        {...form.getInputProps('building_type')}
        mb="sm"
      />
      <Group justify="right" mt="lg">
        <Button variant="default" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Add Building</Button>
      </Group>
    </Modal>
  );
};

export default AddBuildingModal;
