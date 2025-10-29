// src/pages/users/UserManagementPage.tsx
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
  Select,
} from '@mantine/core';
import { IconPlus, IconPencil, IconTrash, IconShield } from '@tabler/icons-react';

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
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  // Edit form state
  const [editRole, setEditRole] = useState('');

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

  const handleAddUser = async () => {
    showSuccessToast('This feature is for demonstration purposes. A secure server-side function is required to invite users.');
    setIsAddModalOpen(false);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ role: editRole })
      .eq('id', selectedUser.id)
      .select();

    if (error) {
      showErrorToast(error.message);
    } else if (data) {
      setUsers(users.map((u) => (u.id === selectedUser.id ? data[0] : u)));
      showSuccessToast('User role updated successfully!');
      setIsEditModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    showErrorToast('User deletion is not yet implemented.');
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const openEditModal = (user: UserProfile) => {
    setSelectedUser(user);
    setEditRole(user.role);
    setIsEditModalOpen(true);
  }

  const rows = users.map((user) => (
    <tr key={user.id}>
      <td>{user.full_name}</td>
      <td>{user.role}</td>
      <td>
        <Group spacing="xs">
          <ActionIcon onClick={() => openEditModal(user)}>
            <IconPencil size={16} />
          </ActionIcon>
          <ActionIcon color="red" onClick={() => { setSelectedUser(user); setIsDeleteModalOpen(true); }}>
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
        <Title order={2}>User Management</Title>
        <Button leftIcon={<IconPlus size={14} />} onClick={() => setIsAddModalOpen(true)}>
          Add User
        </Button>
      </Group>

      <Table striped highlightOnHover withBorder withColumnBorders>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>

      {/* Add User Modal */}
      <Modal opened={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New User">
        <TextInput label="Email" placeholder="user@example.com" mb="md" />
        <TextInput label="Full Name" placeholder="John Doe" mb="md" />
        <Button onClick={handleAddUser}>Invite User</Button>
      </Modal>

      {/* Edit User Modal */}
      <Modal opened={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit User Role">
        <Select
          label="Role"
          value={editRole}
          onChange={(value) => setEditRole(value || '')}
          data={[
            { value: 'super_admin', label: 'Super Admin' },
            { value: 'co_admin', label: 'Co-Admin' },
            { value: 'estate_user', label: 'Estate User' },
          ]}
          mb="md"
        />
        <Button onClick={handleUpdateUser}>Update Role</Button>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <Text>Are you sure you want to delete the user "{selectedUser?.full_name}"?</Text>
        <Group mt="md" position="right">
          <Button variant="default" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
          <Button color="red" onClick={handleDeleteUser}>Delete</Button>
        </Group>
      </Modal>
    </div>
  );
};

export default UserManagementPage;
