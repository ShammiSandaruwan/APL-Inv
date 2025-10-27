// src/pages/categories/EditCategoryModal.tsx
import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';
import type { Category } from './CategoriesPage';

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateCategory: (category: Category) => void;
  category: Category | null;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({ isOpen, onClose, onUpdateCategory, category }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setCode(category.code);
      setDescription(category.description);
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category) {
      onUpdateCategory({ ...category, name, code, description });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Category">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Category Name"
          id="name"
          name="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Category Code"
          id="code"
          name="code"
          type="text"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Input
          label="Description"
          id="description"
          name="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditCategoryModal;
