// src/layout/Header.tsx
import { ActionIcon, Flex, TextInput } from '@mantine/core';
import { IconBell, IconSearch } from '@tabler/icons-react';
import React from 'react';

const Header: React.FC = () => {
  return (
    <Flex align="center" gap="sm" w="100%">
      <TextInput
        placeholder="Search for anything..."
        radius="md"
        style={{ flex: 1, minWidth: 0 }}
        leftSection={<IconSearch size={16} />}
      />
      <ActionIcon variant="light" radius="xl" visibleFrom="sm">
        <IconBell size={18} />
      </ActionIcon>
    </Flex>
  );
};

export default Header;
