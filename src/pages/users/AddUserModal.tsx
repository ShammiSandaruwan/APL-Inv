// src/pages/users/AddUserModal.tsx
import { Button, Group, Modal, Stack, Text } from '@mantine/core';
import React from 'react';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal opened={isOpen} onClose={onClose} title="Add New User" centered>
      <Stack gap="md">
        <Text>
          Creating new users directly from the client is disabled for security
          reasons.
        </Text>
        <Text c="dimmed" size="sm">
          To add a new user, please invite them through the Supabase dashboard.
          This ensures that the invitation and password setup process remains
          secure. A future update will include a secure server-side function to
          handle this process directly from the app.
        </Text>
        <Group justify="flex-end" mt="md">
          <Button variant="outline" color="gray" onClick={onClose}>
            Close
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default AddUserModal;
