import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CourseCatalogPage from './pages/CourseCatalogPage';
import RegisterPage from './pages/RegisterPage';
import StudentSchedulePage from './pages/StudentSchedulePage';
import StudentTranscriptPage from './pages/StudentTranscriptPage';
import ProfessorDashboardPage from './pages/ProfessorDashboardPage';
import CourseRosterPage from './pages/CourseRosterPage';
import GradeEntryPage from './pages/GradeEntryPage';
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
            <Route path="/" element={<Layout />}>
              <Route path="courses" element={<CourseCatalogPage />} />
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
              <Route path="schedule" element={
                <ProtectedRoute requiredRole="STUDENT">
                  <StudentSchedulePage />
                </ProtectedRoute>
              } />
              <Route path="transcript" element={
                <ProtectedRoute requiredRole="STUDENT">
                  <StudentTranscriptPage />
                </ProtectedRoute>
              } />
              <Route path="professor/dashboard" element={
                <ProtectedRoute requiredRole="PROFESSOR">
                  <ProfessorDashboardPage />
                </ProtectedRoute>
              } />
              <Route path="professor/course/:courseId/roster" element={
                <ProtectedRoute requiredRole="PROFESSOR">
                  <CourseRosterPage />
                </ProtectedRoute>
              } />
              <Route path="professor/course/:courseId/grades" element={
                <ProtectedRoute requiredRole="PROFESSOR">
                  <GradeEntryPage />
                </ProtectedRoute>
              } />
              <Route path="admin/users" element={
                <ProtectedRoute requiredRole="ADMIN">
                  <UserManagementPage />
                </ProtectedRoute>
              } />
              <Route path="admin/courses" element={
                <ProtectedRoute requiredRole="ADMIN">
                  <CourseManagementPage />
                </ProtectedRoute>
              } />
              <Route path="admin/students" element={
                <ProtectedRoute requiredRole="ADMIN">
                  <StudentManagementPage />
                </ProtectedRoute>
              } />
              <Route path="admin/enrollments" element={
                <ProtectedRoute requiredRole="ADMIN">
                  <EnrollmentManagementPage />
                </ProtectedRoute>
              } />
              <Route path="admin/grades" element={
                <ProtectedRoute requiredRole="ADMIN">
                  <GradeManagementPage />
                </ProtectedRoute>
              } />
              <Route path="admin/analytics" element={
                <ProtectedRoute requiredRole="ADMIN">
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