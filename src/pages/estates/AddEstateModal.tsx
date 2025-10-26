// src/pages/estates/AddEstateModal.tsx
import React from 'react';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';
import type { Estate } from './EstatesPage';

interface AddEstateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEstate: (estate: Omit<Estate, 'id' | 'is_active'>) => void;
}

const AddEstateModal: React.FC<AddEstateModalProps> = ({ isOpen, onClose, onAddEstate }) => {
  const [name, setName] = React.useState('');
  const [code, setCode] = React.useState('');
  const [location, setLocation] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEstate({ name, code, location, description: '' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Estate">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Estate Name"
          id="name"
          name="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Estate Code"
          id="code"
          name="code"
          type="text"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Input
          label="Location/City"
          id="location"
          name="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Save Estate
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEstateModal;
