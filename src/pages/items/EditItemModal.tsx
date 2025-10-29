// src/pages/items/EditItemModal.tsx
import { Modal, TextInput, Button, Select, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { Item, Building } from '../../types';
import type { Estate } from '../../types';
import ImageUpload from '../../components/ImageUpload';

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateItem: (item: Item) => void;
  item: Item | null;
}

const EditItemModal: React.FC<EditItemModalProps> = ({ isOpen, onClose, onUpdateItem, item }) => {
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
    if (item) {
      form.setValues({
        name: item.name,
        item_code: item.item_code,
        estate_id: item.estate_id,
        building_id: item.building_id,
      });
      setImageUrls(item.photos || []);
    }
  }, [item]);

  useEffect(() => {
    const fetchEstates = async () => {
      const { data } = await supabase.from('estates').select('*');
      setEstates(data || []);
    };
    fetchEstates();
  }, []);

  useEffect(() => {
    const fetchBuildings = async () => {
      if (form.values.estate_id) {
        const { data } = await supabase.from('buildings').select('*').eq('estate_id', form.values.estate_id);
        setBuildings(data || []);
      }
    };
    fetchBuildings();
  }, [form.values.estate_id]);

  const handleSubmit = () => {
    if (item) {
      onUpdateItem({ ...item, ...form.values, photos: imageUrls });
    }
    onClose();
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Edit Item">
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
      <ImageUpload onPhotoChange={setImageUrls} initialUrls={imageUrls} />
      <Group justify="right" mt="lg">
        <Button variant="default" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Update Item</Button>
      </Group>
    </Modal>
  );
};

export default EditItemModal;
