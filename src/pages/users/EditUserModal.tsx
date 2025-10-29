// src/pages/users/EditUserModal.tsx
import { Button, Group, Modal, Select, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useEffect } from 'react';
import type { UserProfile } from '../../types';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (user: UserProfile) => void;
  user: UserProfile | null;
  isLoading: boolean;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  onUpdateUser,
  user,
  isLoading,
}) => {
  const form = useForm<{ role: UserProfile['role'] }>({
    initialValues: {
      role: 'user', // Default to 'user' to avoid empty initial state
    },
    validate: {
      role: (value) => (value ? null : 'A role must be selected'),
    },
  });

  useEffect(() => {
    if (user) {
      form.setValues({ role: user.role });
    }
  }, [user]);

  const handleSubmit = (values: { role: UserProfile['role'] }) => {
    if (user) {
      onUpdateUser({ ...user, role: values.role });
    }
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Edit User Role" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Select
            label="Role"
            placeholder="Select a role"
            required
            data={[
              { value: 'super_admin', label: 'Super Admin' },
              { value: 'co_admin', label: 'Co-Admin' },
              { value: 'user', label: 'User' },
            ]}
            {...form.getInputProps('role')}
          />
          <Group justify="flex-end" mt="md">
            <Button
              variant="outline"
              color="gray"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              Save Changes
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default EditUserModal;
