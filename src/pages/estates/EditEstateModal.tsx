// src/pages/estates/EditEstateModal.tsx
import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';
import type { Estate } from './EstatesPage';

interface EditEstateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateEstate: (estate: Estate) => void;
  estate: Estate | null;
}

const EditEstateModal: React.FC<EditEstateModalProps> = ({ isOpen, onClose, onUpdateEstate, estate }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (estate) {
      setName(estate.name);
      setCode(estate.code);
      setLocation(estate.location);
    }
  }, [estate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (estate) {
      onUpdateEstate({ ...estate, name, code, location });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Estate">
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
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditEstateModal;
