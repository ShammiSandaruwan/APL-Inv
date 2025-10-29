// src/pages/categories/AddCategoryModal.tsx
import {
  Button,
  Group,
  Modal,
  Stack,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import React from 'react';
import type { Category } from '../../types';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (category: Omit<Category, 'id' | 'created_at'>) => void;
  isLoading: boolean;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onAddCategory,
  isLoading,
}) => {
  const form = useForm<Omit<Category, 'id' | 'created_at'>>({
    initialValues: {
      name: '',
      code: '',
      description: '',
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'Category name is required'),
      code: (value) => (value.trim().length > 0 ? null : 'Category code is required'),
    },
  });

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen]);

  const handleSubmit = (values: Omit<Category, 'id' | 'created_at'>) => {
    onAddCategory(values);
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Add New Category" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            required
            label="Category Name"
            placeholder="e.g., Furniture"
            {...form.getInputProps('name')}
          />
          <TextInput
            required
            label="Category Code"
            placeholder="e.g., FURN-001"
            {...form.getInputProps('code')}
          />
          <Textarea
            label="Description"
            placeholder="Optional description"
            {...form.getInputProps('description')}
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
              Save Category
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default AddCategoryModal;
