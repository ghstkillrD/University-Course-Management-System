import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
} from '@mui/material';
import { School, Grade, Person } from '@mui/icons-material';
import { enrollmentService } from '../services/enrollmentService';
import type { TranscriptResponse } from '../services/enrollmentService';
import { useAuth } from '../contexts/AuthContext';

const StudentTranscriptPage: React.FC = () => {
  const [transcript, setTranscript] = useState<TranscriptResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'STUDENT') {
      fetchTranscript();
    }
  }, [user]);

  const fetchTranscript = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await enrollmentService.getMyTranscript();
      setTranscript(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load transcript');
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    if (!grade || grade === 'In Progress') return 'default';
    const gradeValue = grade.charAt(0);
    switch (gradeValue) {
      case 'A': return 'success';
      case 'B': return 'primary';
      case 'C': return 'warning';
      case 'D': case 'F': return 'error';
      default: return 'default';
    }
  };

  if (user?.role !== 'STUDENT') {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">
          Only students can view their transcript.
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
        Academic Transcript
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      {transcript && (
        <>
          {/* Student Information */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Student Information
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Name</Typography>
                  <Typography variant="body1" fontWeight="bold">{transcript.student.name}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Student ID</Typography>
                  <Typography variant="body1" fontWeight="bold">{transcript.student.studentId}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Academic Summary */}
          <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Grade color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="h6">{transcript.gpa.toFixed(2)}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Cumulative GPA
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
                    <School color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="h6">{transcript.completedCredits}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Completed Credits
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
                    <School color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="h6">{transcript.enrollments.length}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Courses
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Course History */}
          {transcript.enrollments && transcript.enrollments.length > 0 ? (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Course History
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Course Code</TableCell>
                        <TableCell>Course Title</TableCell>
                        <TableCell>Semester</TableCell>
                        <TableCell>Professor</TableCell>
                        <TableCell>Grade</TableCell>
                        <TableCell>Credits</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transcript.enrollments.map((enrollment) => (
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
                              color={getGradeColor(enrollment.grade || 'In Progress')} 
                              variant={enrollment.grade ? 'filled' : 'outlined'}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">3</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <School sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No course history available
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your transcript will appear here once you complete courses.
                </Typography>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Container>
  );
};

export default StudentTranscriptPage;
