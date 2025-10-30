// src/pages/users/EditUserModal.tsx
import {
  Button,
  Modal,
  Select,
  Stack,
  Switch,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { UserProfile } from '../../types';
import { showErrorToast, showSuccessToast } from '../../utils/toast';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: UserProfile | null;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  user,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useAuth();
  const form = useForm({
    initialValues: {
      full_name: '',
      role: 'estate_user',
      is_active: true,
    },
  });

  useEffect(() => {
    if (user) {
      form.setValues({
        full_name: user.full_name,
        role: user.role,
        is_active: user.is_active,
      });
    }
  }, [user]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!user || !session) {
        showErrorToast('You must be logged in to update a user.');
        return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/update-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ id: user.id, ...values }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }

      showSuccessToast('User updated successfully!');
      onSuccess();
      onClose();
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to update user.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Edit User">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Full Name"
            placeholder="John Doe"
            required
            {...form.getInputProps('full_name')}
          />
          <Select
            label="Role"
            data={[
              { value: 'estate_user', label: 'Estate User' },
              { value: 'co_admin', label: 'Co-Admin' },
              { value: 'super_admin', label: 'Super Admin' },
            ]}
            required
            {...form.getInputProps('role')}
          />
          <Switch
            label="User is Active"
            checked={form.values.is_active}
            {...form.getInputProps('is_active', { type: 'checkbox' })}
          />
          <Button type="submit" loading={isLoading} fullWidth mt="md">
            Save Changes
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};

export default EditUserModal;
