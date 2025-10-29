// src/pages/estates/EditEstateModal.tsx
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
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { Estate } from '../../types';
import { showErrorToast, showSuccessToast } from '../../utils/toast';

interface EditEstateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateEstate: (estate: Estate) => void;
  estate: Estate | null;
}

const EditEstateModal: React.FC<EditEstateModalProps> = ({
  isOpen,
  onClose,
  onUpdateEstate,
  estate,
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

  useEffect(() => {
    if (estate) {
      form.setValues({
        name: estate.name,
        code: estate.code,
        location: estate.location,
        description: estate.description || '',
        is_active: estate.is_active,
      });
    }
  }, [estate]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!estate) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('estates')
        .update(values)
        .eq('id', estate.id)
        .select()
        .single();
      if (error) throw error;
      showSuccessToast('Estate updated successfully!');
      onUpdateEstate(data as Estate);
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to update estate.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Edit Estate" centered>
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
              Save Changes
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default EditEstateModal;
