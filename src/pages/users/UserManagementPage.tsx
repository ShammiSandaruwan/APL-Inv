// src/pages/users/UserManagementPage.tsx
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Loader,
  Stack,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  IconPencil,
  IconPlus,
  IconShield,
  IconTrash,
} from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import React, { useEffect, useState } from 'react';
import ConfirmationModal from '../../components/ConfirmationModal';
import { supabase } from '../../lib/supabaseClient';
import type { UserProfile } from '../../types';
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';
import PermissionsModal from './PermissionsModal';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from('user_profiles').select('*');
        if (error) throw error;
        setUsers(data as UserProfile[]);
      } catch (error: any) {
        showErrorToast(error.message || 'Failed to fetch users.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleUpdateUser = async (updatedUser: UserProfile) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ role: updatedUser.role })
        .eq('id', updatedUser.id)
        .select()
        .single();
      if (error) throw error;
      setUsers(
        users.map((u) => (u.id === updatedUser.id ? (data as UserProfile) : u))
      );
      showSuccessToast('User role updated successfully!');
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to update user role.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    showErrorToast(
      'User deletion via the dashboard is disabled for security. Please manage users in the Supabase console.'
    );
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>User Management</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add User
        </Button>
      </Group>

      <DataTable
        withTableBorder
        borderRadius="sm"
        withColumnBorders
        striped
        highlightOnHover
        records={users}
        columns={[
          { accessor: 'full_name', title: 'Name', sortable: true },
          {
            accessor: 'role',
            title: 'Role',
            render: ({ role }: UserProfile) => (
              <Badge
                color={
                  role === 'super_admin'
                    ? 'red'
                    : role === 'co_admin'
                    ? 'orange'
                    : 'gray'
                }
              >
                {role.replace(/_/g, ' ')}
              </Badge>
            ),
            sortable: true,
          },
          {
            accessor: 'actions',
            title: 'Actions',
            textAlign: 'right',
            render: (user: UserProfile) => (
              <Group gap="xs" justify="flex-end">
                {user.role === 'co_admin' && (
                  <Tooltip label="Permissions">
                    <ActionIcon
                      variant="subtle"
                      color="teal"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsPermissionsModalOpen(true);
                      }}
                    >
                      <IconShield size={16} />
                    </ActionIcon>
                  </Tooltip>
                )}
                <Tooltip label="Edit Role">
                  <ActionIcon
                    variant="subtle"
                    color="blue"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <IconPencil size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Delete User">
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => {
                      setSelectedUser(user);
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

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
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
        isLoading={isSubmitting}
      />

      {selectedUser && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteUser}
          title="Delete User"
          message={`Are you sure you want to delete "${selectedUser.full_name}"? This action is currently disabled.`}
        />
      )}
    </Stack>
  );
};

export default UserManagementPage;
