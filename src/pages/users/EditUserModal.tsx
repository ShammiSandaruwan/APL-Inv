// src/pages/users/EditUserModal.tsx
import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import type { UserProfile } from './UserManagementPage';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (user: UserProfile) => void;
  user: UserProfile | null;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, onUpdateUser, user }) => {
  const [role, setRole] = useState('');

  useEffect(() => {
    if (user) {
      setRole(user.role);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      onUpdateUser({ ...user, role });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit User Role">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-mine-shaft">
            Role
          </label>
          <select
            id="role"
            name="role"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-silver-chalice rounded-md text-sm shadow-sm placeholder-scorpion focus:outline-none focus:ring-bay-leaf focus:border-bay-leaf"
          >
            <option value="super_admin">Super Admin</option>
            <option value="co_admin">Co-Admin</option>
            <option value="user">User</option>
          </select>
        </div>
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

export default EditUserModal;
