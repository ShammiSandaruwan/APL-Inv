// src/pages/users/AddUserModal.tsx
import React from 'react';
import Modal from '../../components/Modal';
import Button from '../../components/Button';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (email: string, fullName: string) => void; // This will no longer be called from the UI
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New User">
      <div className="space-y-4">
        <p className="text-mine-shaft">
          Creating new users directly from the client is disabled for security reasons.
        </p>
        <p className="text-scorpion text-sm">
          To add a new user, please invite them through the Supabase dashboard.
          This ensures that the invitation and password setup process remains secure.
          A future update will include a secure server-side function to handle this process directly from the app.
        </p>
        <div className="flex justify-end pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddUserModal;
