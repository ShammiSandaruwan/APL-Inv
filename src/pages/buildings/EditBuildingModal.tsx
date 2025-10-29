// src/pages/buildings/EditBuildingModal.tsx
import { Button, Group, Modal, Select, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { Building, Estate } from '../../types';
import { showErrorToast, showSuccessToast } from '../../utils/toast';

interface EditBuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateBuilding: (building: Building) => void;
  building: Building | null;
}

const EditBuildingModal: React.FC<EditBuildingModalProps> = ({
  isOpen,
  onClose,
  onUpdateBuilding,
  building,
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
      fetchEstates();
    }
  }, [isOpen]);

  useEffect(() => {
    if (building) {
      form.setValues({
        name: building.name,
        code: building.code,
        estate_id: building.estate_id,
        building_type: building.building_type,
      });
    }
  }, [building]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!building) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('buildings')
        .update(values)
        .eq('id', building.id)
        .select('*, estates(*)')
        .single();
      if (error) throw error;
      showSuccessToast('Building updated successfully!');
      onUpdateBuilding(data as Building);
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to update building.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Edit Building" centered>
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
              Save Changes
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default EditBuildingModal;
