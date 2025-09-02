import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CourseCatalogPage from './pages/CourseCatalogPage';
import RegisterPage from './pages/RegisterPage';
import TestPage from './pages/TestPage';
import UserManagementPage from './pages/UserManagementPage';
import CourseManagementPage from './pages/CourseManagementPage';
import StudentManagementPage from './pages/StudentManagementPage';
import EnrollmentManagementPage from './pages/EnrollmentManagementPage';
import GradeManagementPage from './pages/GradeManagementPage';
import SystemAnalyticsPage from './pages/SystemAnalyticsPage';
import ProtectedRoute from './components/ProtectedRoute';

const theme = createTheme({
  palette: {
    primary: { 
      main: '#1976d2' 
    },
    secondary: { 
      main: '#2d3748' 
    },
    background: { 
      default: '#f7fafc' 
    },
    text: { 
      primary: '#000000' 
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/courses" element={<CourseCatalogPage />} />
            <Route path="/" element={<Layout />}>
              <Route index element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="admin/users" element={
                <ProtectedRoute>
                  <UserManagementPage />
                </ProtectedRoute>
              } />
              <Route path="admin/courses" element={
                <ProtectedRoute>
                  <CourseManagementPage />
                </ProtectedRoute>
              } />
              <Route path="admin/students" element={
                <ProtectedRoute>
                  <StudentManagementPage />
                </ProtectedRoute>
              } />
              <Route path="admin/enrollments" element={
                <ProtectedRoute>
                  <EnrollmentManagementPage />
                </ProtectedRoute>
              } />
              <Route path="admin/grades" element={
                <ProtectedRoute>
                  <GradeManagementPage />
                </ProtectedRoute>
              } />
              <Route path="admin/analytics" element={
                <ProtectedRoute>
                  <SystemAnalyticsPage />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;