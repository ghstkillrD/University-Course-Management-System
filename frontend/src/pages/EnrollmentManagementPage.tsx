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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Search,
  Visibility,
  Cancel,
  CheckCircle,
  Schedule,
  Assessment,
  Person,
  School,
} from '@mui/icons-material';
import api from '../services/api';

interface Enrollment {
  id: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  courseId: number;
  courseCode: string;
  courseTitle: string;
  professor: string;
  semester: string;
  year: number;
  status: string;
  enrollmentDate: string;
  grade?: string;
  credits: number;
  capacity: number;
  enrolled: number;
}

const EnrollmentManagementPage: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [semesterFilter, setSemesterFilter] = useState('ALL');
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    fetchEnrollments();
  }, [searchTerm, statusFilter, semesterFilter]);

  const fetchEnrollments = async () => {
    try {
      // Fetch real enrollments from backend API using authenticated service
      const params = new URLSearchParams({
        page: '0',
        size: '100',
        sortBy: 'id',
        sortDir: 'asc',
      });

      const response = await api.get(`/enrollments?${params}`);
      
      // Transform backend data to match frontend interface
      const transformedEnrollments: Enrollment[] = response.data.content.map((enrollment: any) => ({
        id: enrollment.id,
        studentId: enrollment.studentId,
        studentName: enrollment.studentName || 'Unknown Student',
        studentEmail: enrollment.studentEmail || 'N/A',
        courseId: enrollment.courseId,
        courseCode: enrollment.courseCode || 'N/A',
        courseTitle: enrollment.courseTitle || 'N/A',
        professor: enrollment.professor || 'N/A',
        semester: enrollment.semester || 'Fall',
        year: enrollment.year || 2023,
        status: enrollment.status || 'Enrolled',
        enrollmentDate: enrollment.enrollmentDate || new Date().toISOString().split('T')[0],
        grade: enrollment.grade || undefined,
        credits: enrollment.credits || 3,
        capacity: enrollment.capacity || 30,
        enrolled: enrollment.enrolled || 25
      }));
      
      // Apply filters
      let filtered = transformedEnrollments;
      
      if (searchTerm) {
        filtered = filtered.filter(enrollment =>
          enrollment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          enrollment.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          enrollment.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (statusFilter !== 'ALL') {
        filtered = filtered.filter(enrollment => enrollment.status === statusFilter);
      }
      
      if (semesterFilter !== 'ALL') {
        filtered = filtered.filter(enrollment => enrollment.semester === semesterFilter);
      }
      
      setEnrollments(filtered);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      setEnrollments([]);
    }
  };

  const handleEnrollmentDetails = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setDetailsOpen(true);
  };

  const handleStatusChange = async (enrollmentId: number, newStatus: string) => {
    try {
      // API call to update enrollment status
      console.log(`Updating enrollment ${enrollmentId} to status: ${newStatus}`);
      fetchEnrollments();
    } catch (error) {
      console.error('Error updating enrollment status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'enrolled': return 'success';
      case 'waitlisted': return 'warning';
      case 'dropped': return 'error';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'enrolled': return <CheckCircle />;
      case 'waitlisted': return <Schedule />;
      case 'dropped': return <Cancel />;
      case 'completed': return <School />;
      default: return <Person />;
    }
  };

  const enrollmentStats = {
    total: enrollments.length,
    enrolled: enrollments.filter(e => e.status === 'Enrolled').length,
    waitlisted: enrollments.filter(e => e.status === 'Waitlisted').length,
    completed: enrollments.filter(e => e.status === 'Completed').length,
    dropped: enrollments.filter(e => e.status === 'Dropped').length,
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Enrollment Management
      </Typography>

      {/* Statistics Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ minWidth: 160 }}>
          <CardContent>
            <Typography variant="h6" color="primary">
              Total Enrollments
            </Typography>
            <Typography variant="h4">
              {enrollmentStats.total}
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ minWidth: 160 }}>
          <CardContent>
            <Typography variant="h6" color="success.main">
              Enrolled
            </Typography>
            <Typography variant="h4">
              {enrollmentStats.enrolled}
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ minWidth: 160 }}>
          <CardContent>
            <Typography variant="h6" color="warning.main">
              Waitlisted
            </Typography>
            <Typography variant="h4">
              {enrollmentStats.waitlisted}
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ minWidth: 160 }}>
          <CardContent>
            <Typography variant="h6" color="info.main">
              Completed
            </Typography>
            <Typography variant="h4">
              {enrollmentStats.completed}
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ minWidth: 160 }}>
          <CardContent>
            <Typography variant="h6" color="error.main">
              Dropped
            </Typography>
            <Typography variant="h4">
              {enrollmentStats.dropped}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          label="Search Enrollments"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="ALL">All Statuses</MenuItem>
            <MenuItem value="Enrolled">Enrolled</MenuItem>
            <MenuItem value="Waitlisted">Waitlisted</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Dropped">Dropped</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Semester</InputLabel>
          <Select
            value={semesterFilter}
            label="Semester"
            onChange={(e) => setSemesterFilter(e.target.value)}
          >
            <MenuItem value="ALL">All Semesters</MenuItem>
            <MenuItem value="Fall">Fall</MenuItem>
            <MenuItem value="Spring">Spring</MenuItem>
            <MenuItem value="Summer">Summer</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Enrollments Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Professor</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Credits</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Enrollment Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enrollments.map((enrollment) => (
              <TableRow key={enrollment.id}>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {enrollment.studentName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {enrollment.studentEmail}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {enrollment.courseCode}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {enrollment.courseTitle}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{enrollment.professor}</TableCell>
                <TableCell>{enrollment.semester} {enrollment.year}</TableCell>
                <TableCell>{enrollment.credits}</TableCell>
                <TableCell>{enrollment.enrolled}/{enrollment.capacity}</TableCell>
                <TableCell>
                  <Chip 
                    icon={getStatusIcon(enrollment.status)}
                    label={enrollment.status} 
                    color={getStatusColor(enrollment.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {enrollment.grade ? (
                    <Chip label={enrollment.grade} color="success" size="small" />
                  ) : (
                    <Typography variant="body2" color="text.secondary">-</Typography>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton onClick={() => handleEnrollmentDetails(enrollment)}>
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Grade Assessment">
                    <IconButton>
                      <Assessment />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Enrollment Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Enrollment Details</DialogTitle>
        <DialogContent>
          {selectedEnrollment && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>Student Information</Typography>
                  <Typography><strong>Name:</strong> {selectedEnrollment.studentName}</Typography>
                  <Typography><strong>Email:</strong> {selectedEnrollment.studentEmail}</Typography>
                  <Typography><strong>Student ID:</strong> {selectedEnrollment.studentId}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>Course Information</Typography>
                  <Typography><strong>Course:</strong> {selectedEnrollment.courseCode} - {selectedEnrollment.courseTitle}</Typography>
                  <Typography><strong>Professor:</strong> {selectedEnrollment.professor}</Typography>
                  <Typography><strong>Credits:</strong> {selectedEnrollment.credits}</Typography>
                  <Typography><strong>Semester:</strong> {selectedEnrollment.semester} {selectedEnrollment.year}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>Enrollment Details</Typography>
                  <Typography><strong>Status:</strong> {selectedEnrollment.status}</Typography>
                  <Typography><strong>Enrollment Date:</strong> {new Date(selectedEnrollment.enrollmentDate).toLocaleDateString()}</Typography>
                  <Typography><strong>Grade:</strong> {selectedEnrollment.grade || 'Not assigned'}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>Course Capacity</Typography>
                  <Typography><strong>Enrolled:</strong> {selectedEnrollment.enrolled}</Typography>
                  <Typography><strong>Capacity:</strong> {selectedEnrollment.capacity}</Typography>
                  <Typography><strong>Available:</strong> {selectedEnrollment.capacity - selectedEnrollment.enrolled}</Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  color="success"
                  onClick={() => handleStatusChange(selectedEnrollment.id, 'Enrolled')}
                  disabled={selectedEnrollment.status === 'Enrolled'}
                >
                  Approve Enrollment
                </Button>
                <Button 
                  variant="contained" 
                  color="warning"
                  onClick={() => handleStatusChange(selectedEnrollment.id, 'Waitlisted')}
                  disabled={selectedEnrollment.status === 'Waitlisted'}
                >
                  Move to Waitlist
                </Button>
                <Button 
                  variant="contained" 
                  color="error"
                  onClick={() => handleStatusChange(selectedEnrollment.id, 'Dropped')}
                  disabled={selectedEnrollment.status === 'Dropped'}
                >
                  Drop Enrollment
                </Button>
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

export default EnrollmentManagementPage;
