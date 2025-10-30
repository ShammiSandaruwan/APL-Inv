// src/pages/users/AddUserModal.tsx
import {
  Button,
  Modal,
  PasswordInput,
  Select,
  Stack,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { showErrorToast, showSuccessToast } from '../../utils/toast';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useAuth();
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      full_name: '',
      role: 'estate_user',
    },
    validate: {
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) =>
        value.length >= 6 ? null : 'Password must be at least 6 characters',
      full_name: (value) => (value.trim() ? null : 'Full name is required'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    if (!session) {
      showErrorToast('You must be logged in to create a user.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }

      showSuccessToast('User created successfully!');
      onSuccess();
      onClose();
      form.reset();
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to create user.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Add New User">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Full Name"
            placeholder="John Doe"
            required
            {...form.getInputProps('full_name')}
          />
          <TextInput
            label="Email"
            placeholder="user@example.com"
            required
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Password"
            placeholder="••••••••"
            required
            {...form.getInputProps('password')}
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
          <Button type="submit" loading={isLoading} fullWidth mt="md">
            Create User
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};

export default AddUserModal;
