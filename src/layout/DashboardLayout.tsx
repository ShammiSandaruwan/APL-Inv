// src/layout/DashboardLayout.tsx
import {
  AppShell,
  Button,
  Group,
  Image,
  NavLink,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBuilding,
  IconClock,
  IconDashboard,
  IconFileText,
  IconHome,
  IconLogout,
  IconPackage,
  IconTags,
  IconUsers,
} from '@tabler/icons-react';
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import Header from './Header';

const navLinks = [
  { to: '/', label: 'Dashboard', icon: IconDashboard },
  { to: '/estates', label: 'Estates', icon: IconBuilding },
  { to: '/buildings', label: 'Buildings', icon: IconHome },
  { to: '/items', label: 'Items', icon: IconPackage },
  { to: '/categories', label: 'Categories', icon: IconTags },
  { to: '/users', label: 'Users', icon: IconUsers },
  { to: '/reports', label: 'Reports', icon: IconFileText },
  { to: '/audit-logs', label: 'Audit Logs', icon: IconClock },
];

const DashboardLayout: React.FC = () => {
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const location = useLocation();
  const { profile } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const links = navLinks.map((link) => (
    <NavLink
      key={link.label}
      component={Link}
      to={link.to}
      label={link.label}
      leftSection={<link.icon size={18} />}
      active={location.pathname === link.to}
      onClick={closeMobile} // Auto-close sidebar on mobile
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
          <Header
            mobileOpened={mobileOpened}
            desktopOpened={desktopOpened}
            toggleMobile={toggleMobile}
            toggleDesktop={toggleDesktop}
          />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar
        p="md"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(180deg, #1e3a8a 0%, #2563eb 100%)',
        }}
      >
        <div>
          {/* Logo Section */}
          <Group justify="center" align="center" mb="xl">
            <Image
              src="/APLLogo.png"
              width={40}
              height={44}
              fit="contain"
              alt="APL Logo"
            />
            <Text fw={600} size="lg" ml="xs" c="white">
              Asset Manager
            </Text>
          </Group>

          {/* Navigation */}
          {links}
        </div>

        {/* Bottom Section */}
        <div>
          <Text ta="center" size="sm" mb="xs" c="white">
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
