// src/pages/buildings/AddBuildingModal.tsx
import { Button, Group, Modal, Select, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { Building, Estate } from '../../types';
import { showErrorToast, showSuccessToast } from '../../utils/toast';

interface AddBuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBuilding: (building: Building) => void;
}

const AddBuildingModal: React.FC<AddBuildingModalProps> = ({
  isOpen,
  onClose,
  onAddBuilding,
}) => {
  const [estates, setEstates] = useState<Estate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    initialValues: {
      name: '',
      code: '',
      estate_id: '',
      building_type: '',
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'Building name is required'),
      code: (value) => (value.trim().length > 0 ? null : 'Building code is required'),
      estate_id: (value) => (value ? null : 'An estate must be selected'),
      building_type: (value) => (value ? null : 'A building type must be selected'),
    },
  });

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
      form.reset();
      fetchEstates();
    }
  }, [isOpen]);

  const handleSubmit = async (values: typeof form.values) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('buildings')
        .insert(values)
        .select('*, estates(*)')
        .single();
      if (error) throw error;
      showSuccessToast('Building added successfully!');
      onAddBuilding(data as Building);
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to add building.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Add New Building" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            required
            label="Building Name"
            placeholder="e.g., Main Factory"
            {...form.getInputProps('name')}
          />
          <TextInput
            required
            label="Building Code"
            placeholder="e.g., BLD-001"
            {...form.getInputProps('code')}
          />
          <Select
            required
            label="Estate"
            placeholder="Select an estate"
            data={estates.map((estate) => ({
              value: estate.id,
              label: estate.name,
            }))}
            {...form.getInputProps('estate_id')}
          />
          <Select
            required
            label="Building Type"
            placeholder="Select a type"
            data={[
              'Factory',
              'Bungalow',
              'Staff Quarters',
              'Warehouse',
              'Office',
              'Other',
            ]}
            {...form.getInputProps('building_type')}
          />
          <Group justify="flex-end" mt="md">
            <Button
              variant="outline"
              color="gray"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              Save Building
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default AddBuildingModal;
