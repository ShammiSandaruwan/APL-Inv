// src/pages/categories/CategoriesPage.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import {
  Table,
  Button,
  Group,
  Title,
  Loader,
  Center,
  ActionIcon,
  Modal,
  TextInput,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPlus, IconPencil, IconTrash } from '@tabler/icons-react';
import EmptyState from '../../components/EmptyState'; // Assuming this will be refactored or is generic

// Define the type for a category object
export interface Category {
  id: string;
  name: string;
  code: string;
  description: string;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const form = useForm({
    initialValues: {
      name: '',
      code: '',
      description: '',
    },
    validate: {
      name: (value) => (value.length > 0 ? null : 'Name is required'),
      code: (value) => (value.length > 0 ? null : 'Code is required'),
    },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('categories').select('*');
    if (error) {
      showErrorToast(error.message);
    } else {
      setCategories(data as Category[]);
    }
    setIsLoading(false);
  };

  const openModal = (category: Category | null) => {
    setSelectedCategory(category);
    form.setValues(category || { name: '', code: '', description: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    form.reset();
  };

  const handleSubmit = async (values: typeof form.values) => {
    if (selectedCategory) {
      // Update
      const { data, error } = await supabase
        .from('categories')
        .update(values)
        .eq('id', selectedCategory.id)
        .select();
      if (error) {
        showErrorToast(error.message);
      } else if (data) {
        setCategories(categories.map((c) => (c.id === selectedCategory.id ? data[0] : c)));
        showSuccessToast('Category updated successfully!');
        closeModal();
      }
    } else {
      // Add
      const { data, error } = await supabase.from('categories').insert([values]).select();
      if (error) {
        showErrorToast(error.message);
      } else if (data) {
        setCategories([...categories, data[0]]);
        showSuccessToast('Category added successfully!');
        closeModal();
      }
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    const { error } = await supabase.from('categories').delete().eq('id', selectedCategory.id);
    if (error) {
      showErrorToast(error.message);
    } else {
      setCategories(categories.filter((c) => c.id !== selectedCategory.id));
      showSuccessToast('Category deleted successfully!');
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    }
  };

  const rows = categories.map((category) => (
    <tr key={category.id}>
      <td>{category.name}</td>
      <td>{category.code}</td>
      <td>{category.description}</td>
      <td>
        <Group spacing="xs">
          <ActionIcon onClick={() => openModal(category)}>
            <IconPencil size={16} />
          </ActionIcon>
          <ActionIcon color="red" onClick={() => { setSelectedCategory(category); setIsDeleteModalOpen(true); }}>
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  ));

  if (isLoading) {
    return (
      <Center style={{ height: '100%' }}>
        <Loader />
      </Center>
    );
  }

  return (
    <div>
      <Group position="apart" mb="lg">
        <Title order={2}>Categories Management</Title>
        <Button leftIcon={<IconPlus size={14} />} onClick={() => openModal(null)}>
          Add Category
        </Button>
      </Group>

      {categories.length === 0 ? (
        <EmptyState
          title="No Categories Found"
          message="Get started by adding your first category to the system."
          actionText="Add Your First Category"
          onActionClick={() => openModal(null)}
        />
      ) : (
        <Table striped highlightOnHover withBorder withColumnBorders>
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      )}

      {/* Add/Edit Modal */}
      <Modal
        opened={isModalOpen}
        onClose={closeModal}
        title={selectedCategory ? 'Edit Category' : 'Add New Category'}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput required label="Name" {...form.getInputProps('name')} mb="sm" />
          <TextInput required label="Code" {...form.getInputProps('code')} mb="sm" />
          <TextInput label="Description" {...form.getInputProps('description')} mb="md" />
          <Group position="right">
            <Button variant="default" onClick={closeModal}>Cancel</Button>
            <Button type="submit">Save</Button>
          </Group>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <Text>Are you sure you want to delete the category "{selectedCategory?.name}"?</Text>
        <Group mt="md" position="right">
          <Button variant="default" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
          <Button color="red" onClick={handleDeleteCategory}>Delete</Button>
        </Group>
      </Modal>
    </div>
  );
};

export default CategoriesPage;
