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

  const handleSubmit = () => {
    if (estate) {
      onUpdateEstate({ ...estate, ...form.values });
    }
    onClose();
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Edit Estate">
      <TextInput label="Estate Name" {...form.getInputProps('name')} mb="sm" />
      <TextInput label="Estate Code" {...form.getInputProps('code')} mb="sm" />
      <TextInput label="Location" {...form.getInputProps('location')} mb="sm" />
      <TextInput label="Description" {...form.getInputProps('description')} mb="md" />
      <Group justify="right" mt="lg">
        <Button variant="default" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Update Estate</Button>
      </Group>
    </Modal>
  );
};

export default EditEstateModal;
