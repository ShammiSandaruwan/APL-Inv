// src/pages/users/UserManagementPage.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Spinner from '../../components/Spinner';
import Button from '../../components/Button';
import Table from '../../components/Table';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import PermissionsModal from './PermissionsModal';
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import { FaPlus, FaPencilAlt, FaTrash, FaShieldAlt } from 'react-icons/fa';

// Define the type for a user profile object
export interface UserProfile {
  id: string;
  full_name: string;
  role: string;
}

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from('user_profiles').select('*');

      if (error) {
        showErrorToast(error.message);
      } else {
        setUsers(data as UserProfile[]);
      }
      setIsLoading(false);
    };

    fetchUsers();
  }, []);

  const handleAddUser = async (_email: string, _fullName: string) => {
    showSuccessToast('This feature is for demonstration purposes. A secure server-side function is required to invite users.');
    setIsAddModalOpen(false);
  };

  const handleUpdateUser = async (updatedUser: UserProfile) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ role: updatedUser.role })
      .eq('id', updatedUser.id)
      .select();

    if (error) {
      showErrorToast(error.message);
    } else if (data) {
      setUsers(users.map((u) => (u.id === updatedUser.id ? data[0] : u)));
      showSuccessToast('User role updated successfully!');
      setIsEditModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    // Note: Supabase doesn't allow deleting users via API unless you use the service role.
    // This is a placeholder for a more complex implementation.
    showErrorToast('User deletion is not yet implemented.');
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const columns = [
    { header: 'Name', accessor: 'full_name' },
    { header: 'Role', accessor: 'role' },
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
        <h1 className="text-2xl font-bold text-mine-shaft">User Management</h1>
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center">
          <FaPlus className="mr-2" />
          Add User
        </Button>
      </div>

      <Table
        columns={columns}
        data={users}
        renderActions={(user) => (
          <div className="flex space-x-2">
            {user.role === 'co_admin' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedUser(user);
                  setIsPermissionsModalOpen(true);
                }}
                className="flex items-center"
              >
                <FaShieldAlt />
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSelectedUser(user);
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
                setSelectedUser(user);
                setIsDeleteModalOpen(true);
              }}
              className="flex items-center"
            >
              <FaTrash />
            </Button>
          </div>
        )}
      />

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddUser={handleAddUser}
      />

      <PermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        user={selectedUser}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdateUser={handleUpdateUser}
        user={selectedUser}
      />

      {selectedUser && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteUser}
          title="Delete User"
          message={`Are you sure you want to delete the user "${selectedUser.full_name}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default UserManagementPage;
