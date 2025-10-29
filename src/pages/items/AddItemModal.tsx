// src/pages/items/AddItemModal.tsx
import { Modal, TextInput, Button, Select, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { Building } from '../../types';
import type { Estate } from '../../types';
import ImageUpload from '../../components/ImageUpload';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: any) => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onAddItem }) => {
  const [estates, setEstates] = useState<Estate[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const form = useForm({
    initialValues: {
      name: '',
      item_code: '',
      estate_id: '',
      building_id: '',
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

  useEffect(() => {
    // Fetch buildings based on selected estate
    const fetchBuildings = async () => {
      if (form.values.estate_id) {
        const { data } = await supabase.from('buildings').select('*').eq('estate_id', form.values.estate_id);
        setBuildings(data || []);
      }
    };
    fetchBuildings();
  }, [form.values.estate_id]);

  const handleSubmit = () => {
    onAddItem({ ...form.values, photos: imageUrls });
    form.reset();
    setImageUrls([]);
    onClose();
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Add New Item">
      <TextInput label="Item Name" {...form.getInputProps('name')} mb="sm" />
      <TextInput label="Item Code" {...form.getInputProps('item_code')} mb="sm" />
      <Select
        label="Estate"
        placeholder="Select estate"
        data={estates.map(e => ({ value: e.id || '', label: e.name }))}
        {...form.getInputProps('estate_id')}
        mb="sm"
      />
      <Select
        label="Building"
        placeholder="Select building"
        data={buildings.map(b => ({ value: b.id || '', label: b.name }))}
        {...form.getInputProps('building_id')}
        mb="sm"
      />
      <ImageUpload onPhotoChange={setImageUrls} />
      <Group justify="right" mt="lg">
        <Button variant="default" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Add Item</Button>
      </Group>
    </Modal>
  );
};

export default AddItemModal;
