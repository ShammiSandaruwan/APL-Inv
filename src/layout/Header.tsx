// src/layout/Header.tsx
import { ActionIcon, Flex, TextInput, useMantineColorScheme } from '@mantine/core';
import { IconBell, IconMoonStars, IconSearch, IconSun } from '@tabler/icons-react';
import React from 'react';

const Header: React.FC = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Flex align="center" gap="sm" w="100%">
      <TextInput
        placeholder="Search for anything..."
        radius="md"
        style={{ flex: 1, minWidth: 0 }}
        leftSection={<IconSearch size={16} />}
      />
      <ActionIcon
        variant="light"
        radius="xl"
        onClick={() => toggleColorScheme()}
        aria-label="Toggle color scheme"
      >
        {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoonStars size={18} />}
      </ActionIcon>
      <ActionIcon
        variant="light"
        radius="xl"
        visibleFrom="sm"
        aria-label="View notifications"
      >
        <IconBell size={18} />
      </ActionIcon>
    </Flex>
  );
};

export default Header;
