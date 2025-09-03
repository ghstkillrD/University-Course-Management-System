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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { School, Person, AccessTime, Grade, Delete } from '@mui/icons-material';
import { enrollmentService } from '../services/enrollmentService';
import type { StudentScheduleResponse } from '../services/enrollmentService';
import { useAuth } from '../contexts/AuthContext';

const StudentSchedulePage: React.FC = () => {
  const [schedule, setSchedule] = useState<StudentScheduleResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dropLoading, setDropLoading] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [dropDialog, setDropDialog] = useState<{ open: boolean; courseId: number | null; courseName: string }>({
    open: false,
    courseId: null,
    courseName: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'STUDENT') {
      fetchSchedule();
    }
  }, [user]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await enrollmentService.getMySchedule();
      setSchedule(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleDropCourse = async (courseId: number) => {
    try {
      setDropLoading(courseId);
      setError('');
      
      await enrollmentService.dropCourse(courseId);
      
      // Refresh the schedule
      await fetchSchedule();
      
      setSuccessMessage('Successfully dropped course!');
      setDropDialog({ open: false, courseId: null, courseName: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to drop course');
    } finally {
      setDropLoading(null);
    }
  };

  const openDropDialog = (courseId: number, courseName: string) => {
    setDropDialog({ open: true, courseId, courseName });
  };

  const closeDropDialog = () => {
    setDropDialog({ open: false, courseId: null, courseName: '' });
  };

  if (user?.role !== 'STUDENT') {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">
          Only students can view their schedule.
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
        My Schedule
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>{successMessage}</Alert>}

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <School color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{schedule?.enrollments.length || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enrolled Courses
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
                <Grade color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{schedule?.gpa?.toFixed(2) || 'N/A'}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current GPA
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
                <AccessTime color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{schedule?.totalCredits || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Credits
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Course List */}
      {schedule?.enrollments && schedule.enrollments.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course Code</TableCell>
                <TableCell>Course Title</TableCell>
                <TableCell>Semester</TableCell>
                <TableCell>Professor</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell>Enrollment Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedule.enrollments.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {enrollment.course.code}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {enrollment.course.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={enrollment.course.semester} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Person sx={{ mr: 1, fontSize: 16 }} />
                      <Typography variant="body2">
                        {enrollment.course.professor?.name || 'TBA'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={enrollment.grade || 'In Progress'} 
                      size="small" 
                      color={enrollment.grade ? 'success' : 'default'} 
                      variant={enrollment.grade ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      startIcon={dropLoading === enrollment.courseId ? <CircularProgress size={16} /> : <Delete />}
                      disabled={dropLoading === enrollment.courseId}
                      onClick={() => openDropDialog(enrollment.courseId, enrollment.course.title)}
                    >
                      {dropLoading === enrollment.courseId ? 'Dropping...' : 'Drop'}
                    </Button>
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
            No courses enrolled
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Browse the course catalog to find courses to enroll in.
          </Typography>
          <Button variant="contained" startIcon={<School />} href="/courses">
            Browse Courses
          </Button>
        </Paper>
      )}

      {/* Drop Course Confirmation Dialog */}
      <Dialog
        open={dropDialog.open}
        onClose={closeDropDialog}
        aria-labelledby="drop-dialog-title"
        aria-describedby="drop-dialog-description"
      >
        <DialogTitle id="drop-dialog-title">
          Confirm Course Drop
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="drop-dialog-description">
            Are you sure you want to drop "{dropDialog.courseName}"? 
            This action cannot be undone, and you may need to re-enroll if you change your mind.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDropDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={() => dropDialog.courseId && handleDropCourse(dropDialog.courseId)} 
            color="error" 
            variant="contained"
            disabled={dropLoading !== null}
          >
            Drop Course
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StudentSchedulePage;
