// src/pages/categories/CategoriesPage.tsx
import {
  ActionIcon,
  Button,
  Group,
  Loader,
  Stack,
  Title,
  Tooltip,
} from '@mantine/core';
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import React, { useEffect, useState } from 'react';
import ConfirmationModal from '../../components/ConfirmationModal';
import EmptyState from '../../components/EmptyState';
import { supabase } from '../../lib/supabaseClient';
import type { Category } from '../../types';
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import AddCategoryModal from './AddCategoryModal';
import EditCategoryModal from './EditCategoryModal';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from('categories').select('*');
        if (error) throw error;
        if (isMounted) setCategories(data as Category[]);
      } catch (error: any) {
        showErrorToast(error.message || 'Failed to fetch categories.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddCategory = async (
    category: Omit<Category, 'id' | 'created_at'>
  ) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single();
      if (error) throw error;
      setCategories([...categories, data as Category]);
      showSuccessToast('Category added successfully!');
      setIsAddModalOpen(false);
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to add category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCategory = async (updatedCategory: Category) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updatedCategory)
        .eq('id', updatedCategory.id)
        .select()
        .single();
      if (error) throw error;
      setCategories(
        categories.map((c) => (c.id === updatedCategory.id ? (data as Category) : c))
      );
      showSuccessToast('Category updated successfully!');
      setIsEditModalOpen(false);
      setSelectedCategory(null);
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to update category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', selectedCategory.id);
      if (error) throw error;
      setCategories(categories.filter((c) => c.id !== selectedCategory.id));
      showSuccessToast('Category deleted successfully!');
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to delete category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Categories Management</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Category
        </Button>
      </Group>

      {categories.length === 0 ? (
        <EmptyState
          title="No Categories Found"
          message="Get started by adding your first category to the system."
          actionText="Add Your First Category"
          onActionClick={() => setIsAddModalOpen(true)}
        />
      ) : (
        <DataTable
          withTableBorder
          borderRadius="sm"
          withColumnBorders
          striped
          highlightOnHover
          records={categories}
          columns={[
            { accessor: 'name', title: 'Name', sortable: true },
            { accessor: 'code', title: 'Code', sortable: true },
            { accessor: 'description', title: 'Description', sortable: true },
            {
              accessor: 'actions',
              title: 'Actions',
              textAlign: 'right',
              render: (category: Category) => (
                <Group gap="xs" justify="flex-end">
                  <Tooltip label="Edit Category">
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <IconPencil size={16} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Delete Category">
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              ),
            },
          ]}
        />
      )}

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCategory={handleAddCategory}
        isLoading={isSubmitting}
      />

      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdateCategory={handleUpdateCategory}
        category={selectedCategory}
        isLoading={isSubmitting}
      />

      {selectedCategory && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteCategory}
          title="Delete Category"
          message={`Are you sure you want to delete "${selectedCategory.name}"? This action cannot be undone.`}
        />
      )}
    </Stack>
  );
};

export default CategoriesPage;
