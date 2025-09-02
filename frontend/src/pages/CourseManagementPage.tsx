import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Person as PersonIcon,
  EventNote as EventNoteIcon,
  Groups as GroupsIcon,
} from '@mui/icons-material';
import {
  courseService,
  type CourseResponse,
  type CreateCourseRequest,
  type UpdateCourseRequest,
  type PaginatedCourseResponse
} from '../services/courseService';
import { adminService, type UserResponse } from '../services/adminService';

const CourseManagementPage: React.FC = () => {
  const [courses, setCourses] = useState<PaginatedCourseResponse>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: 10,
    number: 0,
  });
  const [professors, setProfessors] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseResponse | null>(null);

  // Menu states
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCourse, setSelectedCourse] = useState<CourseResponse | null>(null);

  // Pagination and search
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Form data
  const [formData, setFormData] = useState<CreateCourseRequest & { id?: number }>({
    code: '',
    title: '',
    description: '',
    semester: '',
    scheduleInfo: '',
    capacity: 30,
    professorId: undefined,
  });

  const semesters = [
    'Fall 2024', 'Spring 2025', 'Summer 2025', 'Fall 2025',
    'Spring 2026', 'Summer 2026', 'Fall 2026'
  ];

  useEffect(() => {
    loadCourses();
    loadProfessors();
  }, [page, rowsPerPage, searchQuery]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = searchQuery ? 
        await courseService.searchCourses(searchQuery, page, rowsPerPage) :
        await courseService.getAllCourses(page, rowsPerPage);
      setCourses(response);
      setError(null);
    } catch (err) {
      setError('Failed to load courses');
      console.error('Error loading courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadProfessors = async () => {
    try {
      const response = await adminService.getAllUsers(0, 100, 'PROFESSOR', '');
      setProfessors(response.data.content);
    } catch (err) {
      console.error('Error loading professors:', err);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setPage(0);
  };

  const handleCreateCourse = () => {
    setEditingCourse(null);
    setFormData({
      code: '',
      title: '',
      description: '',
      semester: '',
      scheduleInfo: '',
      capacity: 30,
      professorId: undefined,
    });
    setDialogOpen(true);
  };

  const handleEditCourse = (course: CourseResponse) => {
    setEditingCourse(course);
    setFormData({
      id: course.id,
      code: course.code,
      title: course.title,
      description: course.description || '',
      semester: course.semester,
      scheduleInfo: course.scheduleInfo || '',
      capacity: course.capacity,
      professorId: course.professorId,
    });
    setDialogOpen(true);
    setAnchorEl(null);
  };

  const handleDeleteCourse = async (course: CourseResponse) => {
    if (window.confirm(`Are you sure you want to delete "${course.title}"?`)) {
      try {
        await courseService.deleteCourse(course.id);
        setSuccess('Course deleted successfully');
        loadCourses();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete course');
      }
    }
    setAnchorEl(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        const updateData: UpdateCourseRequest = {
          title: formData.title,
          description: formData.description,
          semester: formData.semester,
          scheduleInfo: formData.scheduleInfo,
          capacity: formData.capacity,
          professorId: formData.professorId,
        };
        await courseService.updateCourse(editingCourse.id, updateData);
        setSuccess('Course updated successfully');
      } else {
        await courseService.createCourse(formData);
        setSuccess('Course created successfully');
      }
      setDialogOpen(false);
      loadCourses();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save course');
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingCourse(null);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, course: CourseResponse) => {
    setAnchorEl(event.currentTarget);
    setSelectedCourse(course);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCourse(null);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getEnrollmentStatus = (capacity: number, availableSeats: number) => {
    const enrolled = capacity - availableSeats;
    const percentage = (enrolled / capacity) * 100;
    
    if (percentage >= 90) return { color: 'error' as const, text: 'Full' };
    if (percentage >= 70) return { color: 'warning' as const, text: 'High' };
    return { color: 'success' as const, text: 'Available' };
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Course Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateCourse}
        >
          Create Course
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Paper>
        <Box p={2}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search courses by title..."
              variant="outlined"
              size="small"
              sx={{ minWidth: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="clear search"
                      onClick={handleClearSearch}
                      edge="end"
                      size="small"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course Code</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Semester</TableCell>
                <TableCell>Professor</TableCell>
                <TableCell>Enrollment</TableCell>
                <TableCell>Schedule</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">Loading...</TableCell>
                </TableRow>
              ) : courses.content.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">No courses found</TableCell>
                </TableRow>
              ) : (
                courses.content.map((course) => {
                  const enrollmentStatus = getEnrollmentStatus(course.capacity, course.availableSeats);
                  const enrolled = course.capacity - course.availableSeats;
                  
                  return (
                    <TableRow key={course.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <SchoolIcon color="primary" fontSize="small" />
                          <Typography variant="body2" fontWeight="bold">
                            {course.code}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{course.title}</Typography>
                        {course.description && (
                          <Typography variant="caption" color="text.secondary">
                            {course.description.substring(0, 50)}
                            {course.description.length > 50 ? '...' : ''}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip label={course.semester} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        {course.professorName ? (
                          <Box display="flex" alignItems="center" gap={1}>
                            <PersonIcon fontSize="small" color="action" />
                            <Box>
                              <Typography variant="body2">{course.professorName}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {course.professorEmail}
                              </Typography>
                            </Box>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Not assigned
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <GroupsIcon fontSize="small" color="action" />
                          <Box>
                            <Typography variant="body2">
                              {enrolled}/{course.capacity}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {course.availableSeats} available
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {course.scheduleInfo ? (
                          <Box display="flex" alignItems="center" gap={1}>
                            <EventNoteIcon fontSize="small" color="action" />
                            <Typography variant="body2">{course.scheduleInfo}</Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Not scheduled
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={enrollmentStatus.text}
                          color={enrollmentStatus.color}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={(e) => handleMenuClick(e, course)}
                          size="small"
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={courses.totalElements}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedCourse && handleEditCourse(selectedCourse)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit Course
        </MenuItem>
        <MenuItem onClick={() => selectedCourse && handleDeleteCourse(selectedCourse)}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete Course
        </MenuItem>
      </Menu>

      {/* Create/Edit Course Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <form onSubmit={handleFormSubmit}>
          <DialogTitle>
            {editingCourse ? 'Edit Course' : 'Create New Course'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  required
                  label="Course Code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  sx={{ flex: 1 }}
                  disabled={!!editingCourse}
                  placeholder="e.g., CS101"
                />
                <FormControl sx={{ flex: 1 }} required>
                  <InputLabel>Semester</InputLabel>
                  <Select
                    value={formData.semester}
                    label="Semester"
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  >
                    {semesters.map((semester) => (
                      <MenuItem key={semester} value={semester}>
                        {semester}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <TextField
                required
                label="Course Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                fullWidth
                placeholder="e.g., Introduction to Computer Science"
              />

              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                fullWidth
                multiline
                rows={3}
                placeholder="Course description and objectives..."
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Schedule Information"
                  value={formData.scheduleInfo}
                  onChange={(e) => setFormData({ ...formData, scheduleInfo: e.target.value })}
                  sx={{ flex: 1 }}
                  placeholder="e.g., Mon/Wed/Fri 10:00-11:00 AM"
                />
                <TextField
                  required
                  type="number"
                  label="Capacity"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                  sx={{ flex: 1 }}
                  inputProps={{ min: 1, max: 200 }}
                />
              </Box>

              <FormControl fullWidth>
                <InputLabel>Assigned Professor</InputLabel>
                <Select
                  value={formData.professorId || ''}
                  label="Assigned Professor"
                  onChange={(e) => setFormData({ ...formData, professorId: e.target.value ? Number(e.target.value) : undefined })}
                >
                  <MenuItem value="">
                    <em>No professor assigned</em>
                  </MenuItem>
                  {professors.map((professor) => (
                    <MenuItem key={professor.id} value={professor.id}>
                      {professor.name} ({professor.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingCourse ? 'Update Course' : 'Create Course'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default CourseManagementPage;
