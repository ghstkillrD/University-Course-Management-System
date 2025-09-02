import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
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
} from '@mui/material';
import { School, Person, AccessTime } from '@mui/icons-material';
import { courseService } from '../services/courseService';
import type { Course } from '../types/course';
import { useAuth } from '../contexts/AuthContext';

const CourseCatalogPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

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

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Filters */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search courses..."
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, code, or description"
            />
          </Grid>
          <Grid item xs={12} md={6}>
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
          </Grid>
        </Grid>
      </Box>

      {/* Course Cards */}
      <Grid container spacing={3}>
        {filteredCourses.map((course) => (
          <Grid item xs={12} md={6} lg={4} key={course.id}>
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
                    {course.professor?.name || 'TBA'}
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
                    variant="contained" 
                    disabled={course.availableSeats === 0}
                  >
                    {course.availableSeats === 0 ? 'Full' : 'Register'}
                  </Button>
                ) : (
                  <Button size="small" variant="outlined">
                    View Details
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

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