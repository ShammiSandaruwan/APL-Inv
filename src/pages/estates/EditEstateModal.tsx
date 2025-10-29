// src/pages/estates/EditEstateModal.tsx
import { Modal, TextInput, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import type { Estate } from '../../types';

interface EditEstateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateEstate: (estate: Estate) => void;
  estate: Estate | null;
}

const EditEstateModal: React.FC<EditEstateModalProps> = ({ isOpen, onClose, onUpdateEstate, estate }) => {
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

  useEffect(() => {
    if (estate) {
      form.setValues({
        name: estate.name,
        code: estate.code,
        location: estate.location,
        description: estate.description || '',
      });
    }
  }, [estate]);

  const handleSubmit = (values: typeof form.values) => {
    if (estate) {
      onUpdateEstate({ ...estate, ...values });
    }
    onClose();
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Edit Estate">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput label="Estate Name" {...form.getInputProps('name')} required mb="sm" />
        <TextInput label="Estate Code" {...form.getInputProps('code')} required mb="sm" />
        <TextInput label="Location" {...form.getInputProps('location')} mb="sm" />
        <TextInput label="Description" {...form.getInputProps('description')} mb="md" />
        <Group justify="right" mt="lg">
          <Button variant="default" onClick={onClose}>Cancel</Button>
          <Button type="submit">Update Estate</Button>
        </Group>
      </form>
    </Modal>
  );
};

export default EditEstateModal;
