// src/components/ConfirmationModal.tsx
import { Button, Group, Modal, Text } from '@mantine/core';
import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  return (
    <Modal opened={isOpen} onClose={onClose} title={title} centered>
      <Text>{message}</Text>
      <Group justify="flex-end" mt="md">
        <Button variant="outline" color="gray" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="filled" color="red" onClick={onConfirm}>
          Confirm
        </Button>
      </Group>
    </Modal>
  );
};

export default ConfirmationModal;
