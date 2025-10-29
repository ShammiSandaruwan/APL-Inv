import { AppShell, Burger, ScrollArea, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { NavLink as MantineNavLink } from "@mantine/core";
import { NavLink } from 'react-router-dom';
import { IconDashboard, IconBuilding, IconPackage, IconUsers } from "@tabler/icons-react";
import { Outlet } from "react-router-dom";

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
      <AppShell.Navbar p="md">
        <ScrollArea>
          <NavLink to="/dashboard" onClick={close}>
            <MantineNavLink
              label="Dashboard"
              leftSection={<IconDashboard size={18} />}
              active={window.location.pathname === "/dashboard"}
            />
          </NavLink>
          <NavLink to="/estates" onClick={close}>
            <MantineNavLink
              label="Estates"
              leftSection={<IconBuilding size={18} />}
            />
          </NavLink>
          <NavLink to="/items" onClick={close}>
            <MantineNavLink
              label="Items"
              leftSection={<IconPackage size={18} />}
            />
          </NavLink>
          <NavLink to="/users" onClick={close}>
            <MantineNavLink
              label="Users"
              leftSection={<IconUsers size={18} />}
            />
          </NavLink>
        </ScrollArea>
      </AppShell.Navbar>

      {/* Main Content */}
      <AppShell.Main><Outlet /></AppShell.Main>
    </AppShell>
  );
}
