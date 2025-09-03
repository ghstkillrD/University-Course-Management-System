import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Alert,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { 
  School, 
  Person, 
  Grade, 
  Assignment,
  Visibility,
  Edit
} from '@mui/icons-material';
import { professorService } from '../services/professorService';
import type { ProfessorCourse, ProfessorStats } from '../services/professorService';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfessorDashboardPage: React.FC = () => {
  const [courses, setCourses] = useState<ProfessorCourse[]>([]);
  const [stats, setStats] = useState<ProfessorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'PROFESSOR') {
      fetchProfessorData();
    }
  }, [user]);

  const fetchProfessorData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [coursesData, statsData] = await Promise.all([
        professorService.getMyCourses(),
        professorService.getStats()
      ]);
      
      setCourses(coursesData);
      setStats(statsData);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load professor data');
    } finally {
      setLoading(false);
    }
  };

  const handleViewRoster = (courseId: number) => {
    navigate(`/professor/course/${courseId}/roster`);
  };

  const handleGradeEntry = (courseId: number) => {
    navigate(`/professor/course/${courseId}/grades`);
  };

  const handleEditCourse = (courseId: number) => {
    navigate(`/professor/course/${courseId}/edit`);
  };

  if (user?.role !== 'PROFESSOR') {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">
          Only professors can access this page.
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Professor Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Welcome back, Professor {user.name}!
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      {/* Statistics Cards */}
      {stats && (
        <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <School color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{stats.totalCourses}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Courses
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Person color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{stats.totalStudents}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Students
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Assignment color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{stats.coursesThisSemester}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      This Semester
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Grade color="warning" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{stats.pendingGrades}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending Grades
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      {/* Courses Section */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        My Courses
      </Typography>

      {courses.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course Code</TableCell>
                <TableCell>Course Title</TableCell>
                <TableCell>Semester</TableCell>
                <TableCell>Enrolled</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {course.code}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {course.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={course.semester} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {course.enrolledStudents || course.capacity - course.availableSeats}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {course.capacity}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={() => handleViewRoster(course.id)}
                      >
                        Roster
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<Grade />}
                        onClick={() => handleGradeEntry(course.id)}
                      >
                        Grades
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => handleEditCourse(course.id)}
                      >
                        Edit
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <School sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No courses assigned
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Contact your administrator to get courses assigned to you.
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default ProfessorDashboardPage;
