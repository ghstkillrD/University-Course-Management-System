import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Autocomplete,
} from '@mui/material';
import {
  Edit,
  Search,
  PersonAdd,
  Grade,
  Assessment,
} from '@mui/icons-material';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Student {
  id: number;
  name: string;
  email: string;
  studentId: string;
  major: string;
  year: string;
  status: string;
  gpa: number;
  completedCredits: number;
  totalCredits: number;
  currentEnrollments: any[];
  enrollmentHistory: any[];
}

interface Course {
  id: number;
  code: string;
  title: string;
}

interface EditStudentData {
  name: string;
  email: string;
  major: string;
  year: string;
}

const StudentManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrollmentReason, setEnrollmentReason] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  const [editStudentData, setEditStudentData] = useState<EditStudentData>({
    name: '',
    email: '',
    major: '',
    year: ''
  });

  useEffect(() => {
    fetchStudents();
  }, [searchTerm]);

  const fetchStudents = async () => {
    try {
      // Fetch real students from backend API using the authenticated API service
      const params = new URLSearchParams({
        page: '0',
        size: '100',
        sortBy: 'id',
        sortDir: 'asc',
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await api.get(`/admin/students/detailed?${params}`);
      
      // Transform backend data to match frontend interface
      const transformedStudents: Student[] = response.data.content.map((student: any) => ({
        id: student.id,
        name: student.name || 'N/A',
        email: student.email || 'N/A',
        studentId: student.studentId || `STU${student.id}`,
        major: student.major || 'Undeclared',
        year: student.year || 'Freshman',
        status: student.active ? 'Active' : 'Inactive',
        gpa: student.gpa || 0.0,
        completedCredits: student.completedCredits || 0,
        totalCredits: student.totalCredits || 120,
        currentEnrollments: student.currentEnrollments || [],
        enrollmentHistory: student.enrollmentHistory || []
      }));
      
      setStudents(transformedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
      // Fallback: show empty list rather than mock data to reflect real state
      setStudents([]);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data.content || response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    }
  };

  const handleEditStudent = async () => {
    if (!selectedStudent) return;
    
    try {
      const updateRequest = {
        name: editStudentData.name,
        email: editStudentData.email,
        major: editStudentData.major,
        year: editStudentData.year
      };

      await api.put(`/admin/students/${selectedStudent.id}`, updateRequest);
      setSnackbar({ open: true, message: 'Student updated successfully!', severity: 'success' });
      setEditDialogOpen(false);
      fetchStudents();
    } catch (error: any) {
      console.error('Error updating student:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'Error updating student', 
        severity: 'error' 
      });
    }
  };

  const handleForceEnroll = async () => {
    if (!selectedStudent || !selectedCourse) return;
    
    try {
      await api.post(`/admin/students/${selectedStudent.id}/force-enroll/${selectedCourse.id}`, null, {
        params: { reason: enrollmentReason || 'Admin override' }
      });
      setSnackbar({ open: true, message: 'Student enrolled successfully!', severity: 'success' });
      setEnrollDialogOpen(false);
      setSelectedCourse(null);
      setEnrollmentReason('');
      fetchStudents();
    } catch (error: any) {
      console.error('Error enrolling student:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'Error enrolling student', 
        severity: 'error' 
      });
    }
  };

  const handleGradeManagement = (student: Student) => {
    navigate('/admin/grades', { state: { studentFilter: student.name } });
  };

  const openEditDialog = (student: Student) => {
    setSelectedStudent(student);
    setEditStudentData({
      name: student.name,
      email: student.email,
      major: student.major,
      year: student.year
    });
    setEditDialogOpen(true);
  };

  const openEnrollDialog = (student: Student) => {
    setSelectedStudent(student);
    setEnrollDialogOpen(true);
    fetchCourses();
  };

  const handleStudentDetails = (student: Student) => {
    setSelectedStudent(student);
    setDetailsOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'suspended': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Student Management
      </Typography>

      {/* Statistics Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography variant="h6" color="primary">
              Total Students
            </Typography>
            <Typography variant="h4">
              {students.length}
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography variant="h6" color="success.main">
              Active Students
            </Typography>
            <Typography variant="h4">
              {students.filter(s => s.status === 'Active').length}
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography variant="h6" color="info.main">
              Average GPA
            </Typography>
            <Typography variant="h4">
              {students.length > 0 
                ? (students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2)
                : '0.00'
              }
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Search and Controls */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          label="Search Students"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
      </Box>

      {/* Students Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Major</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>GPA</TableCell>
              <TableCell>Credits</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.studentId}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.major}</TableCell>
                <TableCell>{student.year}</TableCell>
                <TableCell>{student.gpa.toFixed(2)}</TableCell>
                <TableCell>{student.completedCredits}/{student.totalCredits}</TableCell>
                <TableCell>
                  <Chip 
                    label={student.status} 
                    color={getStatusColor(student.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton onClick={() => handleStudentDetails(student)}>
                      <Assessment />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Student">
                    <IconButton onClick={() => openEditDialog(student)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Force Enroll">
                    <IconButton onClick={() => openEnrollDialog(student)}>
                      <PersonAdd />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Grade Management">
                    <IconButton onClick={() => handleGradeManagement(student)}>
                      <Grade />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Student Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Student Details</DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>Personal Information</Typography>
                  <Typography><strong>Name:</strong> {selectedStudent.name}</Typography>
                  <Typography><strong>Email:</strong> {selectedStudent.email}</Typography>
                  <Typography><strong>Student ID:</strong> {selectedStudent.studentId}</Typography>
                  <Typography><strong>Major:</strong> {selectedStudent.major}</Typography>
                  <Typography><strong>Year:</strong> {selectedStudent.year}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>Academic Information</Typography>
                  <Typography><strong>GPA:</strong> {selectedStudent.gpa.toFixed(2)}</Typography>
                  <Typography><strong>Credits:</strong> {selectedStudent.completedCredits}/{selectedStudent.totalCredits}</Typography>
                  <Typography><strong>Status:</strong> {selectedStudent.status}</Typography>
                  <Typography><strong>Current Enrollments:</strong> {selectedStudent.currentEnrollments.length}</Typography>
                </Box>
              </Box>

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Current Enrollments</Typography>
              <Box sx={{ mb: 3 }}>
                {selectedStudent.currentEnrollments.map((enrollment, index) => (
                  <Chip 
                    key={index} 
                    label={`${enrollment.courseCode} - ${enrollment.courseTitle}`} 
                    sx={{ mr: 1, mb: 1 }} 
                  />
                ))}
              </Box>

              <Typography variant="h6" sx={{ mb: 2 }}>Enrollment History</Typography>
              <Box>
                {selectedStudent.enrollmentHistory.map((enrollment, index) => (
                  <Chip 
                    key={index} 
                    label={`${enrollment.courseCode} - Grade: ${enrollment.grade || 'N/A'}`} 
                    sx={{ mr: 1, mb: 1 }}
                    color={enrollment.grade ? 'success' : 'default'}
                  />
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Student</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Full Name"
              value={editStudentData.name}
              onChange={(e) => setEditStudentData({ ...editStudentData, name: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={editStudentData.email}
              onChange={(e) => setEditStudentData({ ...editStudentData, email: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Major"
              value={editStudentData.major}
              onChange={(e) => setEditStudentData({ ...editStudentData, major: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Year</InputLabel>
              <Select
                value={editStudentData.year}
                onChange={(e) => setEditStudentData({ ...editStudentData, year: e.target.value })}
                label="Year"
              >
                <MenuItem value="Freshman">Freshman</MenuItem>
                <MenuItem value="Sophomore">Sophomore</MenuItem>
                <MenuItem value="Junior">Junior</MenuItem>
                <MenuItem value="Senior">Senior</MenuItem>
                <MenuItem value="Graduate">Graduate</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditStudent} variant="contained">Update Student</Button>
        </DialogActions>
      </Dialog>

      {/* Force Enrollment Dialog */}
      <Dialog open={enrollDialogOpen} onClose={() => setEnrollDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Force Enroll Student</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {selectedStudent && (
              <Typography variant="body1">
                <strong>Student:</strong> {selectedStudent.name} ({selectedStudent.studentId})
              </Typography>
            )}
            <Autocomplete
              options={courses}
              getOptionLabel={(course) => `${course.code} - ${course.title}`}
              value={selectedCourse}
              onChange={(_, newValue) => setSelectedCourse(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Select Course" required />
              )}
            />
            <TextField
              label="Reason (optional)"
              value={enrollmentReason}
              onChange={(e) => setEnrollmentReason(e.target.value)}
              multiline
              rows={3}
              fullWidth
              helperText="Provide a reason for this force enrollment"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEnrollDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleForceEnroll} variant="contained" disabled={!selectedCourse}>
            Force Enroll
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentManagementPage;
