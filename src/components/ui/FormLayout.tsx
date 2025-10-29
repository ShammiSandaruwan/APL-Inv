// src/components/ui/FormLayout.tsx
import { Paper, Title, Group, Button } from '@mantine/core';
import type { ReactNode } from 'react';

interface FormLayoutProps {
  title: string;
  children: ReactNode;
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const FormLayout: React.FC<FormLayoutProps> = ({ title, children, onCancel, onSubmit, isSubmitting }) => {
  return (
    <Paper withBorder shadow="md" p={30} radius="md">
      <Title order={3} mb="xl">{title}</Title>

      {children}

      <Group justify="right" mt="xl">
        <Button variant="default" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit} loading={isSubmitting}>
          Save Changes
        </Button>
      </Group>
    </Paper>
  );
};

export default FormLayout;
