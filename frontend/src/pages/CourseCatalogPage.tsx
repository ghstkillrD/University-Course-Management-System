import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { School, Person, AccessTime } from '@mui/icons-material';
import { courseService } from '../services/courseService';
import { enrollmentService } from '../services/enrollmentService';
import type { Course } from '../types/course';
import { useAuth } from '../contexts/AuthContext';

const CourseCatalogPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [enrollmentLoading, setEnrollmentLoading] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<number>>(new Set());
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchCourses();
    if (isAuthenticated && user?.role === 'STUDENT') {
      fetchEnrolledCourses();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, selectedSemester]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getAllCoursesLegacy();
      setCourses(data);
    } catch (err: any) {
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const schedule = await enrollmentService.getMySchedule();
      const enrolledIds = new Set(schedule.enrollments.map(enrollment => enrollment.courseId));
      setEnrolledCourseIds(enrolledIds);
    } catch (err: any) {
      console.error('Failed to fetch enrolled courses:', err);
    }
  };  const filterCourses = () => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSemester) {
      filtered = filtered.filter((course) => course.semester === selectedSemester);
    }

    setFilteredCourses(filtered);
  };

  const getUniqueSemesters = () => {
    const semesters = courses.map((course) => course.semester);
    return [...new Set(semesters)];
  };

  const handleEnrollment = async (courseId: number) => {
    if (!isAuthenticated || user?.role !== 'STUDENT') {
      setError('Only students can enroll in courses');
      return;
    }

    try {
      setEnrollmentLoading(courseId);
      setError('');
      
      await enrollmentService.enrollInCourse(courseId);
      
      // Update enrolled courses list
      setEnrolledCourseIds(prev => new Set(prev).add(courseId));
      
      // Update the course in the local state to reflect enrollment
      setCourses(prevCourses => 
        prevCourses.map(course => 
          course.id === courseId 
            ? { ...course, availableSeats: course.availableSeats - 1 }
            : course
        )
      );
      
      setSuccessMessage('Successfully enrolled in course!');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to enroll in course');
    } finally {
      setEnrollmentLoading(null);
    }
  };

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
        Course Catalog
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>{successMessage}</Alert>}

      {/* Filters */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label="Search courses..."
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, code, or description"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Semester</InputLabel>
              <Select
                value={selectedSemester}
                label="Semester"
                onChange={(e) => setSelectedSemester(e.target.value)}
              >                <MenuItem value="">All Semesters</MenuItem>
                {getUniqueSemesters().map((semester) => (
                  <MenuItem key={semester} value={semester}>
                    {semester}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>

      {/* Course Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr', 
          md: 'repeat(2, 1fr)', 
          lg: 'repeat(3, 1fr)' 
        }, 
        gap: 3 
      }}>
        {filteredCourses.map((course) => (
          <Box key={course.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Typography variant="h6" component="h2">
                    {course.code}
                  </Typography>
                  <Chip 
                    label={course.semester} 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                  />
                </Box>
                
                <Typography variant="h6" gutterBottom>
                  {course.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {course.description}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Person sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2">
                    {course.professor?.user?.name || 'TBA'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccessTime sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2">
                    {course.scheduleInfo || 'Schedule TBA'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <School sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2">
                    {course.availableSeats}/{course.capacity} seats available
                  </Typography>
                </Box>
              </CardContent>
              
              <CardActions>
                {isAuthenticated && user?.role === 'STUDENT' ? (
                  <Button 
                    size="small" 
                    variant={enrolledCourseIds.has(course.id) ? "outlined" : "contained"}
                    disabled={
                      course.availableSeats === 0 || 
                      enrollmentLoading === course.id || 
                      enrolledCourseIds.has(course.id)
                    }
                    onClick={() => handleEnrollment(course.id)}
                    startIcon={enrollmentLoading === course.id ? <CircularProgress size={16} /> : <School />}
                  >
                    {enrollmentLoading === course.id 
                      ? 'Enrolling...' 
                      : enrolledCourseIds.has(course.id)
                        ? 'Enrolled'
                        : course.availableSeats === 0 
                          ? 'Full' 
                          : 'Register'
                    }
                  </Button>
                ) : (
                  <Button size="small" variant="outlined">
                    View Details
                  </Button>
                )}
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>

      {filteredCourses.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No courses found matching your criteria.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default CourseCatalogPage;