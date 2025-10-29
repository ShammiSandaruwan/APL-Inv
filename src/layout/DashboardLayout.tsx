// src/layout/DashboardLayout.tsx
import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Button from '../components/Button';
import logo from '../assets/logo.png';
import { Image, Drawer, Box } from '@mantine/core';
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
import { useAuth } from '../hooks/useAuth'; // Get user info
import Header from './Header';

const DashboardLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });
  const { profile } = useAuth();

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--mantine-color-body)', color: 'var(--mantine-color-text)' }}>
      {/* Sidebar */}
      <Box component="aside" hiddenFrom="sm" style={{ transition: 'width 300ms ease-in-out', backgroundColor: 'var(--mantine-color-body)', borderRight: '1px solid var(--mantine-color-border)', display: 'flex', flexDirection: 'column', width: isCollapsed ? '6rem' : '18rem' }}>
          <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center' }}>
            <Image src={logo} alt="Company Logo" h={40} fit="contain" />
          {!isCollapsed && <span style={{ marginLeft: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}>Your App</span>}
          <button onClick={() => setIsCollapsed(!isCollapsed)} style={{ color: 'var(--mantine-color-gray-5)', marginLeft: 'auto' }} aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            {isCollapsed ? <IconChevronRight /> : <IconChevronLeft />}
          </button>
        </div>

        <nav style={{ flex: '1', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { to: "/", icon: IconDashboard, label: "Dashboard" },
            { to: "/estates", icon: IconBuilding, label: "Estates", badge: 15 },
            { to: "/buildings", icon: IconBuilding, label: "Buildings" },
            { to: "/items", icon: IconBox, label: "Items", badge: 248 },
            { to: "/categories", icon: IconTag, label: "Categories" },
            { to: "/users", icon: IconUsers, label: "Users" },
            { to: "/reports", icon: IconChartBar, label: "Reports" },
            { to: "/audit-logs", icon: IconHistory, label: "Audit Logs" },
          ].map(link => (
            <NavLink key={link.to} to={link.to} end={link.to === "/"} style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'space-between',
              height: isCollapsed ? '3rem' : 'auto',
              width: isCollapsed ? '3rem' : 'auto',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--mantine-radius-md)',
              color: isActive ? 'white' : 'var(--mantine-color-gray-7)',
              backgroundColor: isActive ? 'var(--mantine-color-primary-6)' : 'transparent',
              transition: 'all 200ms ease',
              '&:hover': {
                backgroundColor: isActive ? 'var(--mantine-color-primary-7)' : 'var(--mantine-color-primary-light)',
              },
            })}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <link.icon style={{ fontSize: '1.25rem', marginRight: !isCollapsed ? '1rem' : '0' }} />
                {!isCollapsed && <span>{link.label}</span>}
              </div>
              {!isCollapsed && link.badge && (
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: 'var(--mantine-color-secondary-light)', color: 'var(--mantine-color-secondary)', borderRadius: '9999px', padding: '0.125rem 0.5rem' }}>{link.badge}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--mantine-color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img style={{ height: '2.5rem', width: '2.5rem', borderRadius: '9999px', objectFit: 'cover' }} src="https://i.pravatar.cc/100" alt="User" />
            {!isCollapsed && (
              <div style={{ marginLeft: '1rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--mantine-color-text)' }}>{profile?.full_name || 'Admin User'}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--mantine-color-dimmed)' }}>{profile?.role || 'Super Admin'}</p>
              </div>
            )}
            <Button onClick={handleLogout} variant="secondary" size="sm" style={{ marginLeft: 'auto' }} aria-label="Logout">
              <IconLogout />
            </Button>
          </div>
        </div>
      </Box>

      {/* Main Content */}
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'margin-left 300ms ease-in-out', marginLeft: isCollapsed ? '6rem' : '18rem' }}>
        <Header isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <main style={{ flex: '1', overflowY: 'auto', padding: '2rem' }}>
          <Outlet />
        </main>
      </div>
      <Drawer
        opened={isCollapsed}
        onClose={() => setIsCollapsed(false)}
        title="Menu"
        padding="xl"
        size="md"
        hiddenFrom="sm"
      >
        <nav style={{ flex: '1', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { to: "/", icon: IconDashboard, label: "Dashboard" },
            { to: "/estates", icon: IconBuilding, label: "Estates", badge: 15 },
            { to: "/buildings", icon: IconBuilding, label: "Buildings" },
            { to: "/items", icon: IconBox, label: "Items", badge: 248 },
            { to: "/categories", icon: IconTag, label: "Categories" },
            { to: "/users", icon: IconUsers, label: "Users" },
            { to: "/reports", icon: IconChartBar, label: "Reports" },
            { to: "/audit-logs", icon: IconHistory, label: "Audit Logs" },
          ].map(link => (
            <NavLink key={link.to} to={link.to} end={link.to === "/"} style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--mantine-radius-md)',
              color: isActive ? 'white' : 'var(--mantine-color-gray-7)',
              backgroundColor: isActive ? 'var(--mantine-color-primary-6)' : 'transparent',
              transition: 'all 200ms ease',
              '&:hover': {
                backgroundColor: isActive ? 'var(--mantine-color-primary-7)' : 'var(--mantine-color-primary-light)',
              },
            })}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <link.icon style={{ fontSize: '1.25rem', marginRight: '1rem' }} />
                <span>{link.label}</span>
              </div>
              {link.badge && (
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: 'var(--mantine-color-secondary-light)', color: 'var(--mantine-color-secondary)', borderRadius: '9999px', padding: '0.125rem 0.5rem' }}>{link.badge}</span>
              )}
            </NavLink>
          ))}
        </nav>
      </Drawer>
    </div>
  );
};

export default DashboardLayout;
