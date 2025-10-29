// src/layout/MainLayout.tsx
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { AppShell, Navbar, Header, Text, ActionIcon, Group, useMantineTheme, Burger, MediaQuery } from '@mantine/core';
import {
  IconDashboard,
  IconBuilding,
  IconBox,
  IconLogout,
  IconTag,
  IconUsers,
  IconChartBar,
  IconHistory,
  IconChevronLeft,
  IconChevronRight
} from '@tabler/icons-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import logo from '../assets/logo.png';

const navLinks = [
  { to: "/", icon: IconDashboard, label: "Dashboard" },
  { to: "/estates", icon: IconBuilding, label: "Estates" },
  { to: "/buildings", icon: IconBuilding, label: "Buildings" },
  { to: "/items", icon: IconBox, label: "Items" },
  { to: "/categories", icon: IconTag, label: "Categories" },
  { to: "/users", icon: IconUsers, label: "Users" },
  { to: "/reports", icon: IconChartBar, label: "Reports" },
  { to: "/audit-logs", icon: IconHistory, label: "Audit Logs" },
];

export default function MainLayout() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const { profile } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AppShell
      padding="md"
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar p="xs" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
          <Navbar.Section grow mt="md">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                style={{ textDecoration: 'none' }}
              >
                {({ isActive }) => (
                  <Group
                    p="xs"
                    sx={(theme) => ({
                      color: isActive ? theme.colors.indigo[6] : theme.colors.gray[7],
                      backgroundColor: isActive ? theme.colors.indigo[0] : 'transparent',
                      borderRadius: theme.radius.sm,
                      '&:hover': {
                        backgroundColor: theme.colors.gray[0],
                      },
                    })}
                  >
                    <link.icon size={20} />
                    <Text>{link.label}</Text>
                  </Group>
                )}
              </NavLink>
            ))}
          </Navbar.Section>
          <Navbar.Section>
            <Group position="apart">
              <Group>
                <img className="h-10 w-10 rounded-full object-cover" src="https://i.pravatar.cc/100" alt="User" />
                <div>
                  <Text size="sm" weight={500}>{profile?.full_name || 'Admin User'}</Text>
                  <Text size="xs" color="dimmed">{profile?.role || 'Super Admin'}</Text>
                </div>
              </Group>
              <ActionIcon onClick={handleLogout}>
                <IconLogout size={20} />
              </ActionIcon>
            </Group>
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={70} p="md">
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <img src={logo} alt="Company Logo" className="w-8 h-8" />
            <Text ml="md" size="xl" weight={700}>Estate & Asset Management</Text>
          </div>
        </Header>
      }
    >
      <Outlet />
    </AppShell>
  );
}
