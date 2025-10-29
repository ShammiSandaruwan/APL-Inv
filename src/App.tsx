// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import EstatesPage from './pages/estates/EstatesPage';
import BuildingsPage from './pages/buildings/BuildingsPage';
import ItemsPage from './pages/items/ItemsPage';
import CategoriesPage from './pages/categories/CategoriesPage';
import EstateDetailPage from './pages/estates/EstateDetailPage';
import BuildingDetailPage from './pages/buildings/BuildingDetailPage';
import ItemDetailPage from './pages/items/ItemDetailPage';
import UserManagementPage from './pages/users/UserManagementPage';
import ReportsPage from './pages/reports/ReportsPage';
import AuditLogsPage from './pages/audit/AuditLogsPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './router/ProtectedRoute';
import MainLayout from './layout/MainLayout';
import { useAuth } from './hooks/useAuth';
import { Loader, Center } from '@mantine/core';

const App: React.FC = () => {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <Center style={{ height: '100vh' }}><Loader /></Center>;
  }

  return (
    <Routes>
      <Route path="/login" element={session ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/" element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="estates" element={<EstatesPage />} />
            <Route path="estates/:id" element={<EstateDetailPage />} />
            <Route path="buildings" element={<BuildingsPage />} />
            <Route path="buildings/:id" element={<BuildingDetailPage />} />
            <Route path="items" element={<ItemsPage />} />
            <Route path="items/:id" element={<ItemDetailPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
