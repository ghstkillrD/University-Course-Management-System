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
} from '@mui/material';
import {
  Add,
  Edit,
  Search,
  PersonAdd,
  Grade,
  Assessment,
} from '@mui/icons-material';
import api from '../services/api';

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

const StudentManagementPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

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

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {/* Add new student logic */}}
        >
          Add Student
        </Button>
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
                    <IconButton>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Force Enroll">
                    <IconButton>
                      <PersonAdd />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Grade Management">
                    <IconButton>
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
    </Box>
  );
};

export default StudentManagementPage;
