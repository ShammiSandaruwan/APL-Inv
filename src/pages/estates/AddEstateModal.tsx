// src/pages/estates/AddEstateModal.tsx
import React from 'react';
import { Modal, TextInput, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import type { Estate } from '../../types';

interface AddEstateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEstate: (estate: Omit<Estate, 'id' | 'is_active' | 'created_at'>) => void;
}

const AddEstateModal: React.FC<AddEstateModalProps> = ({ isOpen, onClose, onAddEstate }) => {
  const form = useForm({
    initialValues: {
      name: '',
      code: '',
      location: '',
      description: '',
    },
    validate: {
      name: (value) => (value.length > 0 ? null : 'Estate name is required'),
      code: (value) => (value.length > 0 ? null : 'Estate code is required'),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    onAddEstate(values);
    form.reset();
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Add New Estate">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Estate Name"
          placeholder="Enter estate name"
          {...form.getInputProps('name')}
          required
        />
        <TextInput
          label="Estate Code"
          placeholder="Enter estate code"
          {...form.getInputProps('code')}
          required
          mt="md"
        />
        <TextInput
          label="Location/City"
          placeholder="Enter location"
          {...form.getInputProps('location')}
          mt="md"
        />
        <Group justify="right" mt="lg">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Save Estate
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default AddEstateModal;
