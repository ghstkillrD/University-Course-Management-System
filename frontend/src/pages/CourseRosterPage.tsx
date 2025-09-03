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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { 
  ArrowBack,
  Grade,
  Email,
  Cancel,
  Save
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { professorService } from '../services/professorService';
import type { CourseRoster, CourseRosterStudent } from '../services/professorService';
import { useAuth } from '../contexts/AuthContext';

const CourseRosterPage: React.FC = () => {
  const [roster, setRoster] = useState<CourseRoster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<CourseRosterStudent | null>(null);
  const [editingGrade, setEditingGrade] = useState('');
  const [savingGrade, setSavingGrade] = useState(false);
  
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (courseId && user?.role === 'PROFESSOR') {
      fetchCourseRoster();
    }
  }, [courseId, user]);

  const fetchCourseRoster = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!courseId) {
        throw new Error('Course ID is required');
      }
      
      const rosterData = await professorService.getCourseRoster(parseInt(courseId));
      setRoster(rosterData);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load course roster');
    } finally {
      setLoading(false);
    }
  };

  const handleGradeEdit = (student: CourseRosterStudent) => {
    setSelectedStudent(student);
    setEditingGrade(student.grade || '');
    setGradeDialogOpen(true);
  };

  const handleGradeSave = async () => {
    if (!selectedStudent || !courseId) return;
    
    try {
      setSavingGrade(true);
      
      await professorService.updateGrade({
        enrollmentId: selectedStudent.enrollmentId,
        grade: editingGrade
      });
      
      // Update local state
      if (roster) {
        const updatedStudents = roster.students.map(student =>
          student.enrollmentId === selectedStudent.enrollmentId
            ? { ...student, grade: editingGrade }
            : student
        );
        setRoster({
          ...roster,
          students: updatedStudents
        });
      }
      
      setGradeDialogOpen(false);
      setSelectedStudent(null);
      setEditingGrade('');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update grade');
    } finally {
      setSavingGrade(false);
    }
  };

  const handleCloseGradeDialog = () => {
    setGradeDialogOpen(false);
    setSelectedStudent(null);
    setEditingGrade('');
  };

  const getGradeColor = (grade: string | null) => {
    if (!grade) return 'default';
    
    const gradeValue = grade.toUpperCase();
    if (gradeValue === 'A' || gradeValue === 'A+') return 'success';
    if (gradeValue === 'B' || gradeValue === 'B+') return 'info';
    if (gradeValue === 'C' || gradeValue === 'C+') return 'warning';
    if (gradeValue === 'D' || gradeValue === 'F') return 'error';
    return 'default';
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

  if (!roster) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">
          Course roster not found.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/professor/dashboard')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography variant="h4" gutterBottom>
            {roster.courseCode} - {roster.courseTitle}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {roster.semester} • {roster.students.length} Students
          </Typography>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      {/* Course Info Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Course Information</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Semester:</strong> {roster.semester}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Enrolled Students:</strong> {roster.totalEnrolled}
          </Typography>
        </CardContent>
      </Card>

      {/* Student Roster */}
      <Typography variant="h5" gutterBottom>
        Student Roster
      </Typography>

      {roster.students.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roster.students.map((student) => (
                <TableRow key={student.studentId}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {student.studentId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {student.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {student.email || 'Not provided'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label="Enrolled" 
                      size="small" 
                      color="success"
                      variant="outlined" 
                    />
                  </TableCell>
                  <TableCell>
                    {student.grade ? (
                      <Chip 
                        label={student.grade} 
                        size="small" 
                        color={getGradeColor(student.grade)}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Not graded
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Edit Grade">
                        <IconButton 
                          size="small" 
                          onClick={() => handleGradeEdit(student)}
                          color="primary"
                        >
                          <Grade />
                        </IconButton>
                      </Tooltip>
                      {student.email && (
                        <Tooltip title="Email Student">
                          <IconButton 
                            size="small" 
                            onClick={() => window.open(`mailto:${student.email}`)}
                            color="primary"
                          >
                            <Email />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No students enrolled
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Students will appear here once they enroll in this course.
          </Typography>
        </Paper>
      )}

      {/* Grade Edit Dialog */}
      <Dialog open={gradeDialogOpen} onClose={handleCloseGradeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit Grade for {selectedStudent?.name}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Grade</InputLabel>
            <Select
              value={editingGrade}
              onChange={(e) => setEditingGrade(e.target.value)}
              label="Grade"
            >
              <MenuItem value="">No Grade</MenuItem>
              <MenuItem value="A+">A+</MenuItem>
              <MenuItem value="A">A</MenuItem>
              <MenuItem value="A-">A-</MenuItem>
              <MenuItem value="B+">B+</MenuItem>
              <MenuItem value="B">B</MenuItem>
              <MenuItem value="B-">B-</MenuItem>
              <MenuItem value="C+">C+</MenuItem>
              <MenuItem value="C">C</MenuItem>
              <MenuItem value="C-">C-</MenuItem>
              <MenuItem value="D+">D+</MenuItem>
              <MenuItem value="D">D</MenuItem>
              <MenuItem value="F">F</MenuItem>
              <MenuItem value="I">I (Incomplete)</MenuItem>
              <MenuItem value="W">W (Withdrawn)</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseGradeDialog} 
            startIcon={<Cancel />}
            disabled={savingGrade}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleGradeSave} 
            variant="contained"
            startIcon={<Save />}
            disabled={savingGrade}
          >
            {savingGrade ? 'Saving...' : 'Save Grade'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CourseRosterPage;
