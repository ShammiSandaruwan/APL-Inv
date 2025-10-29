// src/utils/toast.ts
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';

export const showSuccessToast = (message: string) => {
  notifications.show({
    title: 'Success',
    message,
    color: 'teal',
    icon: <IconCheck size={18} />,
  });
};

export const showErrorToast = (message: string) => {
  notifications.show({
    title: 'Error',
    message,
    color: 'red',
    icon: <IconX size={18} />,
  });
};
