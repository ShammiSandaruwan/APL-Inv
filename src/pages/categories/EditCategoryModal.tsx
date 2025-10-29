// src/pages/categories/EditCategoryModal.tsx
import {
  Button,
  Group,
  Modal,
  Stack,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useEffect } from 'react';
import type { Category } from '../../types';

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateCategory: (category: Category) => void;
  category: Category | null;
  isLoading: boolean;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  isOpen,
  onClose,
  onUpdateCategory,
  category,
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

  useEffect(() => {
    if (category) {
      form.setValues({
        name: category.name,
        code: category.code,
        description: category.description || '',
      });
    }
  }, [category]);

  const handleSubmit = (values: Omit<Category, 'id' | 'created_at'>) => {
    if (category) {
      onUpdateCategory({
        ...category,
        ...values,
      });
    }
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Edit Category" centered>
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
              Save Changes
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default EditCategoryModal;
