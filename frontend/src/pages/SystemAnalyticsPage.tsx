import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  School,
  People,
  Assessment,
  Timeline,
} from '@mui/icons-material';
import api from '../services/api';

interface SystemMetrics {
  totalStudents: number;
  totalCourses: number;
  totalEnrollments: number;
  activeEnrollments: number;
  completedCourses: number;
  averageGPA: number;
  enrollmentTrend: number;
  graduationRate: number;
}

interface CourseAnalytics {
  courseCode: string;
  courseTitle: string;
  professor: string;
  enrollments: number;
  capacity: number;
  averageGrade: string;
  averageGPA: number;
  completionRate: number;
  dropRate: number;
}

interface StudentPerformance {
  year: string;
  semester: string;
  totalStudents: number;
  averageGPA: number;
  honorRoll: number;
  probation: number;
  graduated: number;
}

const SystemAnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('current_semester');
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [courseAnalytics, setCourseAnalytics] = useState<CourseAnalytics[]>([]);
  const [performanceData, setPerformanceData] = useState<StudentPerformance[]>([]);

  useEffect(() => {
    fetchSystemMetrics();
    fetchCourseAnalytics();
    fetchPerformanceData();
  }, [timeRange]);

  const fetchSystemMetrics = async () => {
    try {
      // Fetch real system statistics from backend API using authenticated service
      try {
        const response = await api.get('/admin/system-stats');
        const data = response.data;
        const transformedMetrics: SystemMetrics = {
          totalStudents: data.totalStudents || 0,
          totalCourses: data.totalCourses || 0,
          totalEnrollments: data.totalEnrollments || 0,
          activeEnrollments: data.activeEnrollments || 0,
          completedCourses: data.completedCourses || 0,
          averageGPA: data.averageGPA || 0.0,
          enrollmentTrend: data.enrollmentTrend || 0,
          graduationRate: data.graduationRate || 0,
        };
        setMetrics(transformedMetrics);
      } catch (systemStatsError) {
        // Fallback to basic stats
        const basicResponse = await api.get('/admin/stats');
        const basicData = basicResponse.data;
        const fallbackMetrics: SystemMetrics = {
          totalStudents: basicData.totalStudents || 0,
          totalCourses: 0, // Will need to fetch from courses endpoint
          totalEnrollments: 0,
          activeEnrollments: 0,
          completedCourses: 0,
          averageGPA: 3.0,
          enrollmentTrend: 0,
          graduationRate: 85,
        };
        setMetrics(fallbackMetrics);
      }
    } catch (error) {
      console.error('Error fetching system metrics:', error);
      // Set empty metrics
      setMetrics({
        totalStudents: 0,
        totalCourses: 0,
        totalEnrollments: 0,
        activeEnrollments: 0,
        completedCourses: 0,
        averageGPA: 0.0,
        enrollmentTrend: 0,
        graduationRate: 0,
      });
    }
  };

  const fetchCourseAnalytics = async () => {
    try {
      // Fetch real courses from backend API using authenticated service
      const response = await api.get('/courses?page=0&size=100');
      const data = response.data;
      
      // Transform backend course data to analytics format
      const transformedCourseAnalytics: CourseAnalytics[] = data.content.map((course: any) => ({
        courseCode: course.code || 'N/A',
        courseTitle: course.title || 'N/A',
        professor: course.professorName || 'TBD',
        enrollments: course.enrollmentCount || 0,
        capacity: course.capacity || 30,
        averageGrade: 'B+', // Default since we don't have this data yet
        averageGPA: 3.2, // Default
        completionRate: course.enrollmentCount ? Math.min(95, (course.enrollmentCount / course.capacity) * 100) : 0,
        dropRate: course.enrollmentCount ? Math.max(5, 100 - (course.enrollmentCount / course.capacity) * 100) : 0,
      }));
      
      setCourseAnalytics(transformedCourseAnalytics);
    } catch (error) {
      console.error('Error fetching course analytics:', error);
      setCourseAnalytics([]);
    }
  };

  const fetchPerformanceData = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockPerformanceData: StudentPerformance[] = [
        {
          year: '2023',
          semester: 'Fall',
          totalStudents: 1247,
          averageGPA: 3.24,
          honorRoll: 186,
          probation: 94,
          graduated: 0,
        },
        {
          year: '2023',
          semester: 'Spring',
          totalStudents: 1198,
          averageGPA: 3.18,
          honorRoll: 167,
          probation: 108,
          graduated: 278,
        },
        {
          year: '2022',
          semester: 'Fall',
          totalStudents: 1156,
          averageGPA: 3.15,
          honorRoll: 152,
          probation: 115,
          graduated: 0,
        },
      ];
      setPerformanceData(mockPerformanceData);
    } catch (error) {
      console.error('Error fetching performance data:', error);
    }
  };

  const getPerformanceColor = (value: number, type: 'gpa' | 'rate') => {
    if (type === 'gpa') {
      if (value >= 3.5) return 'success';
      if (value >= 3.0) return 'info';
      if (value >= 2.5) return 'warning';
      return 'error';
    } else {
      if (value >= 90) return 'success';
      if (value >= 80) return 'info';
      if (value >= 70) return 'warning';
      return 'error';
    }
  };

  const getTrendIcon = (trend: number) => {
    return trend >= 0 ? (
      <TrendingUp sx={{ color: 'success.main' }} />
    ) : (
      <TrendingDown sx={{ color: 'error.main' }} />
    );
  };

  if (!metrics) {
    return <Box sx={{ p: 3 }}>Loading...</Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          System Analytics
        </Typography>
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="current_semester">Current Semester</MenuItem>
            <MenuItem value="academic_year">Academic Year</MenuItem>
            <MenuItem value="last_year">Last Year</MenuItem>
            <MenuItem value="all_time">All Time</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Key Metrics Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <People color="primary" />
              <Typography variant="h6" color="primary">
                Total Students
              </Typography>
            </Box>
            <Typography variant="h3">
              {metrics.totalStudents.toLocaleString()}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getTrendIcon(metrics.enrollmentTrend)}
              <Typography variant="body2" color="text.secondary">
                {metrics.enrollmentTrend > 0 ? '+' : ''}{metrics.enrollmentTrend}% from last semester
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <School color="info" />
              <Typography variant="h6" color="info.main">
                Total Courses
              </Typography>
            </Box>
            <Typography variant="h3">
              {metrics.totalCourses}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active courses this semester
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Timeline color="success" />
              <Typography variant="h6" color="success.main">
                Active Enrollments
              </Typography>
            </Box>
            <Typography variant="h3">
              {metrics.activeEnrollments.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Out of {metrics.totalEnrollments.toLocaleString()} total
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Assessment color="warning" />
              <Typography variant="h6" color="warning.main">
                Average GPA
              </Typography>
            </Box>
            <Typography variant="h3">
              {metrics.averageGPA.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              System-wide average
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Additional Metrics */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ minWidth: 250, flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Graduation Rate
            </Typography>
            <Typography variant="h4" color="success.main">
              {metrics.graduationRate}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={metrics.graduationRate}
              color="success"
              sx={{ mt: 1, height: 8 }}
            />
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 250, flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Course Completion Rate
            </Typography>
            <Typography variant="h4" color="info.main">
              {((metrics.completedCourses / metrics.totalEnrollments) * 100).toFixed(1)}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={(metrics.completedCourses / metrics.totalEnrollments) * 100}
              color="info"
              sx={{ mt: 1, height: 8 }}
            />
          </CardContent>
        </Card>
      </Box>

      {/* Course Performance Analytics */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Course Performance Analytics
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Course</TableCell>
                  <TableCell>Professor</TableCell>
                  <TableCell>Enrollment</TableCell>
                  <TableCell>Avg Grade</TableCell>
                  <TableCell>Avg GPA</TableCell>
                  <TableCell>Completion Rate</TableCell>
                  <TableCell>Drop Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courseAnalytics.map((course) => (
                  <TableRow key={course.courseCode}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {course.courseCode}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {course.courseTitle}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{course.professor}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">
                          {course.enrollments}/{course.capacity}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={(course.enrollments / course.capacity) * 100}
                          sx={{ width: 60, height: 6 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={course.averageGrade} 
                        color={getPerformanceColor(course.averageGPA, 'gpa') as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {course.averageGPA.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">
                          {course.completionRate.toFixed(1)}%
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={course.completionRate}
                          color={getPerformanceColor(course.completionRate, 'rate') as any}
                          sx={{ width: 60, height: 6 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        color={course.dropRate > 15 ? 'error.main' : course.dropRate > 10 ? 'warning.main' : 'text.primary'}
                      >
                        {course.dropRate.toFixed(1)}%
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Historical Performance */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Historical Performance
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Period</TableCell>
                  <TableCell>Total Students</TableCell>
                  <TableCell>Average GPA</TableCell>
                  <TableCell>Honor Roll</TableCell>
                  <TableCell>Academic Probation</TableCell>
                  <TableCell>Graduated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {performanceData.map((period, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {period.semester} {period.year}
                      </Typography>
                    </TableCell>
                    <TableCell>{period.totalStudents.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip 
                        label={period.averageGPA.toFixed(2)} 
                        color={getPerformanceColor(period.averageGPA, 'gpa') as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">
                          {period.honorRoll} ({((period.honorRoll / period.totalStudents) * 100).toFixed(1)}%)
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography 
                          variant="body2"
                          color={period.probation > period.totalStudents * 0.1 ? 'error.main' : 'text.primary'}
                        >
                          {period.probation} ({((period.probation / period.totalStudents) * 100).toFixed(1)}%)
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {period.graduated > 0 ? (
                        <Typography variant="body2" color="success.main">
                          {period.graduated}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">-</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SystemAnalyticsPage;
