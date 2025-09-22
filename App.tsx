
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import AppointmentsPage from './components/pages/AppointmentsPage';
import DoctorDashboardPage from './components/pages/DoctorDashboardPage';
import AdminDashboardPage from './components/pages/AdminDashboardPage';
import ProtectedRoute from './components/shared/ProtectedRoute';
import { Role } from './types';

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route 
          path="/appointments" 
          element={
            <ProtectedRoute roles={[Role.Patient]}>
              <AppointmentsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/doctor-dashboard" 
          element={
            <ProtectedRoute roles={[Role.Doctor]}>
              <DoctorDashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute roles={[Role.Admin]}>
              <AdminDashboardPage />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
};

export default App;
