import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage       from './pages/LoginPage';
import AdminLoginPage  from './pages/AdminLoginPage';
import DashboardPage   from './pages/DashboardPage';
import TicketsPage     from './pages/TicketsPage';
import SLAConfigPage   from './pages/SLAConfigPage';
import AnalyticsPage   from './pages/AnalyticsPage';
import AlertsPage      from './pages/AlertsPage';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color: '#fff', padding: 40 }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"       element={<LoginPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index                element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard"    element={<DashboardPage />} />
            <Route path="tickets"      element={<TicketsPage />} />
            <Route path="sla-config"   element={<ProtectedRoute adminOnly><SLAConfigPage /></ProtectedRoute>} />
            <Route path="analytics"    element={<AnalyticsPage />} />
            <Route path="alerts"       element={<AlertsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
