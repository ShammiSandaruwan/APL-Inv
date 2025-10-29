// src/pages/items/EditItemModal.tsx
import { Button, Group, Modal, Select, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useEffect, useState } from 'react';
import ImageUpload from '../../components/ImageUpload';
import { supabase } from '../../lib/supabaseClient';
import type { Building, Estate, Item } from '../../types';
import { showErrorToast, showSuccessToast } from '../../utils/toast';

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateItem: (item: Item) => void;
  item: Item | null;
}

const EditItemModal: React.FC<EditItemModalProps> = ({
  isOpen,
  onClose,
  onUpdateItem,
  item,
}) => {
  const [estates, setEstates] = useState<Estate[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<Omit<Item, 'id' | 'created_at' | 'buildings'>>({
    initialValues: {
      name: '',
      item_code: '',
      estate_id: '',
      building_id: '',
      photos: [],
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'Item name is required'),
      item_code: (value) => (value.trim().length > 0 ? null : 'Item code is required'),
      estate_id: (value) => (value ? null : 'An estate must be selected'),
      building_id: (value) => (value ? null : 'A building must be selected'),
    },
  });

  useEffect(() => {
    const fetchEstates = async () => {
      const { data, error } = await supabase.from('estates').select('*');
      if (error) showErrorToast(error.message);
      else setEstates(data as Estate[]);
    };
    if (isOpen) {
      fetchEstates();
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchBuildings = async () => {
      if (form.values.estate_id) {
        const { data, error } = await supabase
          .from('buildings')
          .select('*')
          .eq('estate_id', form.values.estate_id);
        if (error) showErrorToast(error.message);
        else setBuildings(data as Building[]);
      }
    };
    fetchBuildings();
  }, [form.values.estate_id]);

  useEffect(() => {
    if (item) {
      form.setValues({
        name: item.name,
        item_code: item.item_code,
        estate_id: item.estate_id,
        building_id: item.building_id,
        photos: item.photos || [],
      });
    }
  }, [item]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!item) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('items')
        .update(values)
        .eq('id', item.id)
        .select('*, buildings(*, estates(*))')
        .single();
      if (error) throw error;
      showSuccessToast('Item updated successfully!');
      onUpdateItem(data as Item);
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to update item.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Edit Item" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput required label="Item Name" {...form.getInputProps('name')} />
          <TextInput required label="Item Code" {...form.getInputProps('item_code')} />
          <Select
            required
            label="Estate"
            placeholder="Select an estate"
            data={estates.map((e) => ({ value: e.id, label: e.name }))}
            {...form.getInputProps('estate_id')}
          />
          <Select
            required
            label="Building"
            placeholder="Select a building"
            data={buildings.map((b) => ({ value: b.id, label: b.name }))}
            disabled={!form.values.estate_id}
            {...form.getInputProps('building_id')}
          />
          <ImageUpload
            onPhotoChange={(urls) => form.setFieldValue('photos', urls)}
            initialUrls={form.values.photos}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="outline" color="gray" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              Save Changes
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default EditItemModal;
