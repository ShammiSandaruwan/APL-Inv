// src/pages/buildings/OccupancyModal.tsx
import {
  Button,
  Group,
  Modal,
  Stack,
  TextInput,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { Building } from '../../types';
import { showErrorToast, showSuccessToast } from '../../utils/toast';

interface OccupancyModalProps {
  isOpen: boolean;
  onClose: () => void;
  building: Building | null;
  onUpdate: (updatedBuilding: Building) => void;
}

const OccupancyModal: React.FC<OccupancyModalProps> = ({
  isOpen,
  onClose,
  building,
  onUpdate,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    initialValues: {
      occupied_by: '',
      occupant_designation: '',
      occupancy_start_date: null as Date | null,
    },
  });

  useEffect(() => {
    if (building) {
      form.setValues({
        occupied_by: building.occupied_by || '',
        occupant_designation: building.occupant_designation || '',
        occupancy_start_date: building.occupancy_start_date
          ? new Date(building.occupancy_start_date)
          : null,
      });
    }
  }, [building]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!building) return;
    setIsLoading(true);

    // Format the date to 'YYYY-MM-DD' for Supabase, handling null case
    const formattedDate = values.occupancy_start_date
      ? values.occupancy_start_date.toISOString().split('T')[0]
      : null;

    try {
      const { data, error } = await supabase
        .from('buildings')
        .update({
          occupied_by: values.occupied_by,
          occupant_designation: values.occupant_designation,
          occupancy_start_date: formattedDate,
        })
        .eq('id', building.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        showSuccessToast('Occupancy updated successfully!');
        onUpdate(data as Building);
      }
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to update occupancy.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={`Occupancy for ${building?.name}`}
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Occupied By"
            placeholder="Enter occupant name"
            {...form.getInputProps('occupied_by')}
          />
          <TextInput
            label="Occupant Designation"
            placeholder="Enter designation"
            {...form.getInputProps('occupant_designation')}
          />
          <DateInput
            label="Occupancy Start Date"
            placeholder="Select start date"
            valueFormat="YYYY-MM-DD"
            {...form.getInputProps('occupancy_start_date')}
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

export default OccupancyModal;
