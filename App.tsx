import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import Portfolio from './pages/dashboard/Portfolio';
import Deposit from './pages/dashboard/Deposit';
import Withdraw from './pages/dashboard/Withdraw';
import History from './pages/dashboard/History';
import Plans from './pages/dashboard/Plans';
import Referral from './pages/dashboard/Referral';
import KYC from './pages/dashboard/KYC';
import Support from './pages/dashboard/Support';

// Legal Pages
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import RiskDisclosure from './pages/legal/RiskDisclosure';
import CookiePolicy from './pages/legal/CookiePolicy';

// Admin Imports
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import Deposits from './pages/admin/Deposits';
import Withdrawals from './pages/admin/Withdrawals';
import KYCVerification from './pages/admin/KYCVerification';
import Announcements from './pages/admin/Announcements';
import SupportTickets from './pages/admin/SupportTickets';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen bg-nexus-dark flex items-center justify-center text-white">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Admin Protected Route Component
const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen bg-nexus-dark flex items-center justify-center text-white">Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Legal Routes */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/risk-disclosure" element={<RiskDisclosure />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />

          {/* Admin Public Route */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Overview />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="deposit" element={<Deposit />} />
            <Route path="withdraw" element={<Withdraw />} />
            <Route path="history" element={<History />} />
            <Route path="plans" element={<Plans />} />
            <Route path="referral" element={<Referral />} />
            <Route path="kyc" element={<KYC />} />
            <Route path="support" element={<Support />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="deposits" element={<Deposits />} />
            <Route path="withdrawals" element={<Withdrawals />} />
            <Route path="kyc" element={<KYCVerification />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="support" element={<SupportTickets />} />
            {/* Placeholders for other admin routes */}
            <Route path="logs" element={<div className="text-white p-8">System Logs (Coming Soon)</div>} />
            <Route path="settings" element={<div className="text-white p-8">Admin Settings (Coming Soon)</div>} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

