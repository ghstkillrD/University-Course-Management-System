import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
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
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import { 
  ArrowBack,
  Save,
  Cancel
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { professorService } from '../services/professorService';
import type { CourseRoster, CourseRosterStudent, GradeUpdateRequest } from '../services/professorService';
import { useAuth } from '../contexts/AuthContext';

const GradeEntryPage: React.FC = () => {
  const [roster, setRoster] = useState<CourseRoster | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [gradeChanges, setGradeChanges] = useState<Map<number, string>>(new Map());
  
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

  const handleGradeChange = (enrollmentId: number, grade: string) => {
    const newChanges = new Map(gradeChanges);
    if (grade === '') {
      newChanges.delete(enrollmentId);
    } else {
      newChanges.set(enrollmentId, grade);
    }
    setGradeChanges(newChanges);
  };

  const getCurrentGrade = (student: CourseRosterStudent) => {
    if (gradeChanges.has(student.enrollmentId)) {
      return gradeChanges.get(student.enrollmentId) || '';
    }
    return student.grade || '';
  };

  const hasChanges = () => {
    return gradeChanges.size > 0;
  };

  const handleSaveAllGrades = async () => {
    if (!hasChanges()) return;
    
    try {
      setSaving(true);
      setError('');
      
      // Convert changes to grade update requests
      const gradeUpdates: GradeUpdateRequest[] = Array.from(gradeChanges.entries()).map(
        ([enrollmentId, grade]) => ({
          enrollmentId,
          grade
        })
      );
      
      await professorService.updateMultipleGrades(gradeUpdates);
      
      // Update local state
      if (roster) {
        const updatedStudents = roster.students.map(student => {
          if (gradeChanges.has(student.enrollmentId)) {
            return { ...student, grade: gradeChanges.get(student.enrollmentId) };
          }
          return student;
        });
        setRoster({
          ...roster,
          students: updatedStudents
        });
      }
      
      setGradeChanges(new Map());
      setSuccess('All grades saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save grades');
    } finally {
      setSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    setGradeChanges(new Map());
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

  const gradeOptions = [
    { value: '', label: 'No Grade' },
    { value: 'A+', label: 'A+' },
    { value: 'A', label: 'A' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B', label: 'B' },
    { value: 'B-', label: 'B-' },
    { value: 'C+', label: 'C+' },
    { value: 'C', label: 'C' },
    { value: 'C-', label: 'C-' },
    { value: 'D+', label: 'D+' },
    { value: 'D', label: 'D' },
    { value: 'F', label: 'F' },
    { value: 'I', label: 'I (Incomplete)' },
    { value: 'W', label: 'W (Withdrawn)' },
  ];

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
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom>
            Grade Entry - {roster.courseCode}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {roster.courseTitle} • {roster.semester} • {roster.students.length} Students
          </Typography>
        </Box>
        {hasChanges() && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={handleDiscardChanges}
              startIcon={<Cancel />}
              disabled={saving}
            >
              Discard Changes
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveAllGrades}
              startIcon={<Save />}
              disabled={saving}
            >
              {saving ? 'Saving...' : `Save ${gradeChanges.size} Changes`}
            </Button>
          </Box>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Grade Entry Table */}
      {roster.students.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Current Grade</TableCell>
                <TableCell>New Grade</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roster.students.map((student) => (
                <TableRow key={student.enrollmentId}>
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
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={getCurrentGrade(student)}
                        onChange={(e) => handleGradeChange(student.enrollmentId, e.target.value)}
                        displayEmpty
                      >
                        {gradeOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    {gradeChanges.has(student.enrollmentId) ? (
                      <Chip label="Modified" size="small" color="warning" />
                    ) : (
                      <Chip label="Unchanged" size="small" color="default" variant="outlined" />
                    )}
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

      {hasChanges() && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
          <Typography variant="body2">
            You have {gradeChanges.size} unsaved grade changes. Click "Save Changes" to apply them.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default GradeEntryPage;
