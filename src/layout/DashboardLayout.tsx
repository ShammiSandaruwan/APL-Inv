import { AppShell, Burger, ScrollArea, Group, Text, Image, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { NavLink as MantineNavLink } from "@mantine/core";
import { NavLink } from 'react-router-dom';
import { IconDashboard, IconBuilding, IconPackage, IconUsers, IconLogout } from "@tabler/icons-react";
import { Outlet } from "react-router-dom";
import logo from '../assets/logo.png';
import { supabase } from '../lib/supabaseClient';

export default function DashboardLayout() {
  const [opened, { toggle, close }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 260,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      {/* Header Section */}
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text fw={600}>Estate & Asset Management</Text>
          </Group>
        </Group>
      </AppShell.Header>

      {/* Sidebar (Navbar) Section */}
      <AppShell.Navbar
        p="md"
        sx={(theme) => ({
          backgroundColor: theme.colors.indigo[6],
          color: theme.white,
          a: {
            color: theme.white,
            textDecoration: "none",
            "&:hover": { backgroundColor: theme.colors.indigo[5] },
          },
        })}
      >
        <AppShell.Navbar.Section>
          <Group justify="center" mb="md">
            <Image src={logo} h={40} fit="contain" alt="Company Logo" />
          </Group>
        </AppShell.Navbar.Section>
        <ScrollArea>
          <MantineNavLink
            component={Link}
            to="/dashboard"
            label="Dashboard"
            leftSection={<IconDashboard size={18} />}
            onClick={close}
            active={window.location.pathname === "/dashboard"}
          />
          <MantineNavLink
            component={Link}
            to="/estates"
            label="Estates"
            leftSection={<IconBuilding size={18} />}
            onClick={close}
          />
          <MantineNavLink
            component={Link}
            to="/buildings"
            label="Buildings"
            leftSection={<IconBuilding size={18} />}
            onClick={close}
          />
          <MantineNavLink
            component={Link}
            to="/items"
            label="Items"
            leftSection={<IconPackage size={18} />}
            onClick={close}
          />
          <MantineNavLink
            component={Link}
            to="/users"
            label="Users"
            leftSection={<IconUsers size={18} />}
            onClick={close}
          />
        </ScrollArea>
        <AppShell.Navbar.Section mt="auto">
          <Button
            fullWidth
            leftSection={<IconLogout size={16} />}
            variant="light"
            color="red"
            onClick={() => {
              supabase.auth.signOut();
              window.location.href = "/login";
            }}
          >
            Logout
          </Button>
        </AppShell.Navbar.Section>
      </AppShell.Navbar>

      {/* Main Content */}
      <AppShell.Main><Outlet /></AppShell.Main>
    </AppShell>
  );
}
