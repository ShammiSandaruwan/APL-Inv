// src/layout/Header.tsx
import {
  ActionIcon,
  Box,
  Burger,
  Flex,
  Group,
  TextInput,
  useMantineColorScheme,
} from '@mantine/core';
import { IconBell, IconMoon, IconSearch, IconSun } from '@tabler/icons-react';
import React from 'react';

interface HeaderProps {
  mobileOpened: boolean;
  desktopOpened: boolean;
  toggleMobile: () => void;
  toggleDesktop: () => void;
}

const Header: React.FC<HeaderProps> = ({
  mobileOpened,
  desktopOpened,
  toggleMobile,
  toggleDesktop,
}) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Flex align="center" justify="space-between" wrap="nowrap" gap="md" w="100%">
      <Group>
        <Burger
          opened={mobileOpened}
          onClick={toggleMobile}
          hiddenFrom="sm"
          size="sm"
        />
        <Burger
          opened={desktopOpened}
          onClick={toggleDesktop}
          visibleFrom="sm"
          size="sm"
        />
      </Group>
      <Box sx={{ flexGrow: 1, maxWidth: 400 }}>
        <TextInput
          placeholder="Search for anything..."
          leftSection={<IconSearch size={16} />}
          w="100%"
        />
      </Box>
      <Group gap="sm" visibleFrom="sm">
        <ActionIcon variant="subtle" aria-label="View notifications">
          <IconBell />
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          onClick={toggleColorScheme}
          aria-label="Toggle color scheme"
        >
          {colorScheme === 'dark' ? <IconSun /> : <IconMoon />}
        </ActionIcon>
      </Group>
    </Flex>
  );
};

export default Header;
