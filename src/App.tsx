// src/App.tsx
import { Loader } from '@mantine/core';
import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Toast from './components/Toast';
import { useAuth } from './hooks/useAuth';
import DashboardLayout from './layout/DashboardLayout';
import ProtectedRoute from './router/ProtectedRoute';

// Lazy load page components
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const EstatesPage = lazy(() => import('./pages/estates/EstatesPage'));
const EstateDetailPage = lazy(() => import('./pages/estates/EstateDetailPage'));
const BuildingsPage = lazy(() => import('./pages/buildings/BuildingsPage'));
const BuildingDetailPage = lazy(() => import('./pages/buildings/BuildingDetailPage'));
const ItemsPage = lazy(() => import('./pages/items/ItemsPage'));
const ItemDetailPage = lazy(() => import('./pages/items/ItemDetailPage'));
const CategoriesPage = lazy(() => import('./pages/categories/CategoriesPage'));
const UserManagementPage = lazy(() => import('./pages/users/UserManagementPage'));
const ReportsPage = lazy(() => import('./pages/reports/ReportsPage'));
const AuditLogsPage = lazy(() => import('./pages/audit/AuditLogsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const App: React.FC = () => {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Loader color="blue" size="md" />
      </div>
    );
  }

  return (
    <>
      <Toast />
      <Suspense
        fallback={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
            }}
          >
            <Loader color="blue" size="md" />
          </div>
        }
      >
        <Routes>
          <Route path="/login" element={session ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/" element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
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
      </Suspense>
    </>
  );
};

export default App;
