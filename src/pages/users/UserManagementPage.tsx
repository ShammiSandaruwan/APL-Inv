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
  IconBuilding,
  IconPencil,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import React, { useEffect, useState } from 'react';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabaseClient';
import type { UserProfile } from '../../types';
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import AddUserModal from './AddUserModal';
import AssignEstateModal from './AssignEstateModal';
import EditUserModal from './EditUserModal';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const { session } = useAuth();

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeactivateUser = async () => {
    if (!selectedUser || !session) {
        showErrorToast('You must be logged in to deactivate a user.');
        return;
    }

    try {
      const response = await fetch('/api/deactivate-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ id: selectedUser.id }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }

      showSuccessToast('User deactivated successfully!');
      fetchUsers(); // Refresh the list
      setIsDeactivateModalOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to deactivate user.');
    }
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
          Add New User
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
                  role === 'super_admin' ? 'red' : role === 'co_admin' ? 'orange' : 'gray'
                }
              >
                {role.replace(/_/g, ' ')}
              </Badge>
            ),
            sortable: true,
          },
          {
            accessor: 'is_active',
            title: 'Status',
            render: ({ is_active }: UserProfile) => (
              <Badge color={is_active ? 'green' : 'gray'}>
                {is_active ? 'Active' : 'Inactive'}
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
                <Tooltip label="Assign Estate">
                  <ActionIcon
                    variant="subtle"
                    color="teal"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsAssignModalOpen(true);
                    }}
                  >
                    <IconBuilding size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Edit User">
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
                <Tooltip label="Deactivate User">
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsDeactivateModalOpen(true);
                    }}
                    disabled={!user.is_active}
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
        onSuccess={fetchUsers}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchUsers}
        user={selectedUser}
      />

      <AssignEstateModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        user={selectedUser}
      />

      {selectedUser && (
        <ConfirmationModal
          isOpen={isDeactivateModalOpen}
          onClose={() => setIsDeactivateModalOpen(false)}
          onConfirm={handleDeactivateUser}
          title="Deactivate User"
          message={`Are you sure you want to deactivate "${selectedUser.full_name}"?`}
        />
      )}
    </Stack>
  );
};

export default UserManagementPage;
