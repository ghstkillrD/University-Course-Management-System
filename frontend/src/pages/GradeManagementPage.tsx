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
  LinearProgress,
} from '@mui/material';
import {
  Search,
  Edit,
  Assessment,
  Assignment,
} from '@mui/icons-material';
import api from '../services/api';

interface GradeEntry {
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
  grade?: string;
  gradePoints?: number;
  credits: number;
  assignments: Assignment[];
  midtermGrade?: string;
  finalGrade?: string;
  attendance: number;
  participationScore: number;
}

interface Assignment {
  id: number;
  name: string;
  type: string;
  maxPoints: number;
  earnedPoints?: number;
  dueDate: string;
  submitted: boolean;
}

const GradeManagementPage: React.FC = () => {
  const [grades, setGrades] = useState<GradeEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('ALL');
  const [semesterFilter, setSemesterFilter] = useState('ALL');
  const [selectedGrade, setSelectedGrade] = useState<GradeEntry | null>(null);
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);

  useEffect(() => {
    fetchGrades();
  }, [searchTerm, courseFilter, semesterFilter]);

  const fetchGrades = async () => {
    try {
      // Fetch real grades from backend API using authenticated service
      const params = new URLSearchParams({
        page: '0',
        size: '100',
        sortBy: 'id',
        sortDir: 'asc',
        ...(courseFilter !== 'ALL' && { courseCode: courseFilter }),
        ...(semesterFilter !== 'ALL' && { semester: semesterFilter }),
        ...(searchTerm && { studentName: searchTerm }),
      });

      const response = await api.get(`/admin/grades?${params}`);
      
      // Transform backend data to match frontend interface
      const transformedGrades: GradeEntry[] = response.data.content.map((grade: any) => ({
        id: grade.id,
        studentId: grade.studentId,
        studentName: grade.studentName || 'Unknown Student',
        studentEmail: grade.studentEmail || 'N/A',
        courseId: grade.courseId,
        courseCode: grade.courseCode || 'N/A',
        courseTitle: grade.courseTitle || 'N/A',
        professor: grade.professor || 'N/A',
        semester: grade.semester || 'Fall',
        year: grade.year || 2023,
        grade: grade.grade || undefined,
        gradePoints: grade.gradePoints || undefined,
        credits: grade.credits || 3,
        midtermGrade: grade.midtermGrade || undefined,
        finalGrade: grade.finalGrade || undefined,
        attendance: grade.attendance || 95,
        participationScore: grade.participationScore || 90,
        assignments: grade.assignments || [
          {
            id: 1,
            name: 'Assignment 1',
            type: 'Homework',
            maxPoints: 100,
            earnedPoints: grade.gradePoints ? grade.gradePoints * 25 : undefined,
            dueDate: '2023-09-15',
            submitted: !!grade.grade
          }
        ]
      }));
      
      setGrades(transformedGrades);
    } catch (error) {
      console.error('Error fetching grades:', error);
      setGrades([]);
    }
  };

  const handleGradeDetails = (grade: GradeEntry) => {
    setSelectedGrade(grade);
    setGradeDialogOpen(true);
  };

  const calculateOverallScore = (assignments: Assignment[]) => {
    const totalMax = assignments.reduce((sum, a) => sum + a.maxPoints, 0);
    const totalEarned = assignments.reduce((sum, a) => sum + (a.earnedPoints || 0), 0);
    return totalMax > 0 ? (totalEarned / totalMax) * 100 : 0;
  };

  const getGradeColor = (grade?: string) => {
    if (!grade) return 'default';
    const letter = grade.charAt(0);
    switch (letter) {
      case 'A': return 'success';
      case 'B': return 'info';
      case 'C': return 'warning';
      case 'D': case 'F': return 'error';
      default: return 'default';
    }
  };

  const gradeStats = {
    total: grades.length,
    graded: grades.filter(g => g.grade).length,
    pending: grades.filter(g => !g.grade).length,
    averageGPA: grades.filter(g => g.gradePoints).length > 0 
      ? (grades.reduce((sum, g) => sum + (g.gradePoints || 0), 0) / grades.filter(g => g.gradePoints).length).toFixed(2)
      : '0.00'
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Grade Management
      </Typography>

      {/* Statistics Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ minWidth: 180 }}>
          <CardContent>
            <Typography variant="h6" color="primary">
              Total Enrollments
            </Typography>
            <Typography variant="h4">
              {gradeStats.total}
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ minWidth: 180 }}>
          <CardContent>
            <Typography variant="h6" color="success.main">
              Graded
            </Typography>
            <Typography variant="h4">
              {gradeStats.graded}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={gradeStats.total > 0 ? (gradeStats.graded / gradeStats.total) * 100 : 0}
              color="success"
              sx={{ mt: 1 }}
            />
          </CardContent>
        </Card>
        
        <Card sx={{ minWidth: 180 }}>
          <CardContent>
            <Typography variant="h6" color="warning.main">
              Pending
            </Typography>
            <Typography variant="h4">
              {gradeStats.pending}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={gradeStats.total > 0 ? (gradeStats.pending / gradeStats.total) * 100 : 0}
              color="warning"
              sx={{ mt: 1 }}
            />
          </CardContent>
        </Card>
        
        <Card sx={{ minWidth: 180 }}>
          <CardContent>
            <Typography variant="h6" color="info.main">
              Average GPA
            </Typography>
            <Typography variant="h4">
              {gradeStats.averageGPA}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          label="Search Students/Courses"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Course</InputLabel>
          <Select
            value={courseFilter}
            label="Course"
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            <MenuItem value="ALL">All Courses</MenuItem>
            <MenuItem value="CS301">CS301</MenuItem>
            <MenuItem value="MATH401">MATH401</MenuItem>
            <MenuItem value="CS302">CS302</MenuItem>
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

        <Button
          variant="contained"
          startIcon={<Assessment />}
          onClick={() => {/* Bulk grade entry logic */}}
        >
          Bulk Grade Entry
        </Button>
      </Box>

      {/* Grades Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Professor</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Overall Score</TableCell>
              <TableCell>Attendance</TableCell>
              <TableCell>Participation</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>GPA Points</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grades.map((grade) => {
              const overallScore = calculateOverallScore(grade.assignments);
              return (
                <TableRow key={grade.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {grade.studentName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {grade.studentEmail}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {grade.courseCode}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {grade.courseTitle}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{grade.professor}</TableCell>
                  <TableCell>{grade.semester} {grade.year}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">
                        {overallScore.toFixed(1)}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={overallScore}
                        sx={{ width: 60, height: 6 }}
                        color={overallScore >= 90 ? 'success' : overallScore >= 80 ? 'info' : overallScore >= 70 ? 'warning' : 'error'}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {grade.attendance}%
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {grade.participationScore}%
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {grade.grade ? (
                      <Chip 
                        label={grade.grade} 
                        color={getGradeColor(grade.grade) as any}
                        size="small"
                      />
                    ) : (
                      <Chip label="Pending" color="default" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    {grade.gradePoints ? (
                      <Typography variant="body2" fontWeight="bold">
                        {grade.gradePoints.toFixed(1)}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">-</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Grade Details">
                      <IconButton onClick={() => handleGradeDetails(grade)}>
                        <Assessment />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Grade">
                      <IconButton>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Assignment Grades">
                      <IconButton>
                        <Assignment />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Grade Details Dialog */}
      <Dialog open={gradeDialogOpen} onClose={() => setGradeDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Grade Details</DialogTitle>
        <DialogContent>
          {selectedGrade && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>Student Information</Typography>
                  <Typography><strong>Name:</strong> {selectedGrade.studentName}</Typography>
                  <Typography><strong>Email:</strong> {selectedGrade.studentEmail}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>Course Information</Typography>
                  <Typography><strong>Course:</strong> {selectedGrade.courseCode} - {selectedGrade.courseTitle}</Typography>
                  <Typography><strong>Professor:</strong> {selectedGrade.professor}</Typography>
                  <Typography><strong>Semester:</strong> {selectedGrade.semester} {selectedGrade.year}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>Grade Summary</Typography>
                  <Typography><strong>Final Grade:</strong> {selectedGrade.grade || 'Pending'}</Typography>
                  <Typography><strong>GPA Points:</strong> {selectedGrade.gradePoints?.toFixed(1) || 'N/A'}</Typography>
                  <Typography><strong>Credits:</strong> {selectedGrade.credits}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography><strong>Attendance:</strong> {selectedGrade.attendance}%</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={selectedGrade.attendance}
                      color={selectedGrade.attendance >= 90 ? 'success' : selectedGrade.attendance >= 80 ? 'warning' : 'error'}
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography><strong>Participation:</strong> {selectedGrade.participationScore}%</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={selectedGrade.participationScore}
                      color={selectedGrade.participationScore >= 90 ? 'success' : selectedGrade.participationScore >= 80 ? 'warning' : 'error'}
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                  <Box>
                    <Typography><strong>Overall Score:</strong> {calculateOverallScore(selectedGrade.assignments).toFixed(1)}%</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={calculateOverallScore(selectedGrade.assignments)}
                      color={calculateOverallScore(selectedGrade.assignments) >= 90 ? 'success' : 'warning'}
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>Grade Breakdown</Typography>
                  <Typography><strong>Midterm:</strong> {selectedGrade.midtermGrade || 'Not graded'}</Typography>
                  <Typography><strong>Final:</strong> {selectedGrade.finalGrade || 'Not graded'}</Typography>
                </Box>
              </Box>

              <Typography variant="h6" sx={{ mb: 2 }}>Assignment Details</Typography>
              <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Assignment</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Score</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedGrade.assignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell>{assignment.name}</TableCell>
                        <TableCell>{assignment.type}</TableCell>
                        <TableCell>
                          {assignment.earnedPoints !== undefined 
                            ? `${assignment.earnedPoints}/${assignment.maxPoints}` 
                            : `--/${assignment.maxPoints}`
                          }
                        </TableCell>
                        <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip 
                            label={assignment.submitted ? 'Submitted' : 'Pending'} 
                            color={assignment.submitted ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGradeDialogOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<Edit />}>
            Edit Grades
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GradeManagementPage;
