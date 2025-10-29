// src/components/EmptyState.tsx
import { Button, Stack, Text, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import React from 'react';

interface EmptyStateProps {
  title: string;
  message: string;
  actionText?: string;
  onActionClick?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  actionText,
  onActionClick,
}) => {
  return (
    <Stack align="center" justify="center" gap="md" style={{ height: '50vh' }}>
      <Title order={3}>{title}</Title>
      <Text c="dimmed">{message}</Text>
      {actionText && onActionClick && (
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={onActionClick}
        >
          {actionText}
        </Button>
      )}
    </Stack>
  );
};

export default EmptyState;
