// src/layout/DashboardLayout.tsx
import {
  AppShell,
  Burger,
  Button,
  Group,
  Image,
  NavLink,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBox,
  IconBuilding,
  IconCategory,
  IconDashboard,
  IconHistory,
  IconLogout,
  IconReport,
  IconUsers,
} from '@tabler/icons-react';
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import Header from './Header';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: IconDashboard },
  { to: '/estates', label: 'Estates', icon: IconBuilding },
  { to: '/buildings', label: 'Buildings', icon: IconBuilding },
  { to: '/items', label: 'Items', icon: IconBox },
  { to: '/categories', label: 'Categories', icon: IconCategory },
  { to: '/users', label: 'Users', icon: IconUsers },
  { to: '/reports', label: 'Reports', icon: IconReport },
  { to: '/audit-logs', label: 'Audit Logs', icon: IconHistory },
];

const DashboardLayout: React.FC = () => {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const theme = useMantineTheme();
  const location = useLocation();
  const { profile } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const links = navLinks.map((link) => (
    <NavLink
      key={link.label}
      component={Link}
      to={link.to}
      label={link.label}
      leftSection={<link.icon size="1rem" stroke={1.5} />}
      active={location.pathname === link.to}
      variant="filled"
    />
  ));

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
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
          <Header />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar
        p="md"
        style={{
          backgroundColor: theme.colors.indigo[7],
          color: theme.white,
        }}
      >
        <Stack justify="space-between" style={{ height: '100%' }}>
          <div>
            <Group>
              <Image src={logo} alt="Company Logo" w={40} />
              <Title order={4} c="white">
                Asset Manager
              </Title>
            </Group>
            <Stack mt="md">{links}</Stack>
          </div>
          <Stack>
            <Text c="white" size="sm">
              {profile?.full_name}
            </Text>
            <Button
              onClick={handleLogout}
              variant="light"
              color="gray"
              leftSection={<IconLogout size={16} />}
            >
              Logout
            </Button>
          </Stack>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default DashboardLayout;
