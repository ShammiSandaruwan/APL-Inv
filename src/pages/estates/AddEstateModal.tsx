// src/pages/estates/AddEstateModal.tsx
import {
  Button,
  Checkbox,
  Group,
  Modal,
  Stack,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { Estate } from '../../types';
import { showErrorToast, showSuccessToast } from '../../utils/toast';

interface AddEstateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEstate: (estate: Estate) => void;
}

const AddEstateModal: React.FC<AddEstateModalProps> = ({
  isOpen,
  onClose,
  onAddEstate,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<Omit<Estate, 'id' | 'created_at'>>({
    initialValues: {
      name: '',
      code: '',
      location: '',
      description: '',
      is_active: true,
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'Estate name is required'),
      code: (value) => (value.trim().length > 0 ? null : 'Estate code is required'),
      location: (value) => (value.trim().length > 0 ? null : 'Location is required'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('estates')
        .insert(values)
        .select()
        .single();
      if (error) throw error;
      showSuccessToast('Estate added successfully!');
      onAddEstate(data as Estate);
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to add estate.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Add New Estate" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            required
            label="Estate Name"
            placeholder="e.g., Main Production Site"
            {...form.getInputProps('name')}
          />
          <TextInput
            required
            label="Estate Code"
            placeholder="e.g., EST-001"
            {...form.getInputProps('code')}
          />
          <TextInput
            required
            label="Location"
            placeholder="e.g., Lagos, Nigeria"
            {...form.getInputProps('location')}
          />
          <Textarea
            label="Description"
            placeholder="Optional description"
            {...form.getInputProps('description')}
          />
          <Checkbox
            label="Is Active"
            {...form.getInputProps('is_active', { type: 'checkbox' })}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="outline" color="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              Save Estate
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default AddEstateModal;
