// src/App.tsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const EstatesPage = lazy(() => import('./pages/estates/EstatesPage'));
const BuildingsPage = lazy(() => import('./pages/buildings/BuildingsPage'));
const ItemsPage = lazy(() => import('./pages/items/ItemsPage'));
const CategoriesPage = lazy(() => import('./pages/categories/CategoriesPage'));
const EstateDetailPage = lazy(() => import('./pages/estates/EstateDetailPage'));
const BuildingDetailPage = lazy(() => import('./pages/buildings/BuildingDetailPage'));
const ItemDetailPage = lazy(() => import('./pages/items/ItemDetailPage'));
const UserManagementPage = lazy(() => import('./pages/users/UserManagementPage'));
const ReportsPage = lazy(() => import('./pages/reports/ReportsPage'));
const AuditLogsPage = lazy(() => import('./pages/audit/AuditLogsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
import ProtectedRoute from './router/ProtectedRoute';
import DashboardLayout from './layout/DashboardLayout';
import { useAuth } from './hooks/useAuth';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen"><Spinner /></div>;
  }

  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Spinner /></div>}>
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
  );
};

export default App;
