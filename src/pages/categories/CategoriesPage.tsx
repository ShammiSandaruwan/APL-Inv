// src/pages/categories/CategoriesPage.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Spinner from '../../components/Spinner';
import Button from '../../components/Button';
import Table from '../../components/Table';
import EmptyState from '../../components/EmptyState';
import AddCategoryModal from './AddCategoryModal';
import EditCategoryModal from './EditCategoryModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import { FaPlus, FaPencilAlt, FaTrash } from 'react-icons/fa';

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
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

    fetchCategories();
  }, []);

  const handleAddCategory = async (category: Omit<Category, 'id'>) => {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select();

    if (error) {
      showErrorToast(error.message);
    } else if (data) {
      setCategories([...categories, data[0]]);
      showSuccessToast('Category added successfully!');
      setIsAddModalOpen(false);
    }
  };

  const handleUpdateCategory = async (updatedCategory: Category) => {
    const { data, error } = await supabase
      .from('categories')
      .update(updatedCategory)
      .eq('id', updatedCategory.id)
      .select();

    if (error) {
      showErrorToast(error.message);
    } else if (data) {
      setCategories(categories.map((c) => (c.id === updatedCategory.id ? data[0] : c)));
      showSuccessToast('Category updated successfully!');
      setIsEditModalOpen(false);
      setSelectedCategory(null);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', selectedCategory.id);

    if (error) {
      showErrorToast(error.message);
    } else {
      setCategories(categories.filter((c) => c.id !== selectedCategory.id));
      showSuccessToast('Category deleted successfully!');
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Code', accessor: 'code' },
    { header: 'Description', accessor: 'description' },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-mine-shaft">Categories Management</h1>
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center">
          <FaPlus className="mr-2" />
          Add Category
        </Button>
      </div>

      {categories.length === 0 ? (
        <EmptyState
          title="No Categories Found"
          message="Get started by adding your first category to the system."
          actionText="Add Your First Category"
          onActionClick={() => setIsAddModalOpen(true)}
        />
      ) : (
        <Table
          columns={columns}
          data={categories}
          renderActions={(category) => (
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedCategory(category);
                  setIsEditModalOpen(true);
                }}
                className="flex items-center"
              >
                <FaPencilAlt />
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setSelectedCategory(category);
                  setIsDeleteModalOpen(true);
                }}
                className="flex items-center"
              >
                <FaTrash />
              </Button>
            </div>
          )}
        />
      )}

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCategory={handleAddCategory}
      />

      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdateCategory={handleUpdateCategory}
        category={selectedCategory}
      />

      {selectedCategory && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteCategory}
          title="Delete Category"
          message={`Are you sure you want to delete the category "${selectedCategory.name}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default CategoriesPage;
