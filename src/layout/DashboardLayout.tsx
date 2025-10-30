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
  { to: '/', label: 'Dashboard', icon: IconDashboard },
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
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(180deg, #1e40af 0%, #2563eb 100%)',
          color: 'white',
        }}
      >
        <div>
          <Group mb="xl" gap="xs">
            <Image src={logo} width={32} height={32} radius="sm" alt="Logo" />
            <Text fw={600} c="white">
              Asset Manager
            </Text>
          </Group>
          {links}
        </div>

        <div>
          <Text size="sm" fw={500} mb="xs" ta="center" c="white">
            {profile?.full_name || 'Super Admin'}
          </Text>
          <Button
            fullWidth
            variant="light"
            color="red"
            leftSection={<IconLogout size={16} />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default DashboardLayout;
