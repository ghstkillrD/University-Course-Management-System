import api from './api';

export interface CourseResponse {
  id: number;
  code: string;
  title: string;
  description?: string;
  semester: string;
  scheduleInfo?: string;
  capacity: number;
  availableSeats: number;
  professorId?: number;
  professorName?: string;
  professorEmail?: string;
}

export interface CreateCourseRequest {
  code: string;
  title: string;
  description?: string;
  semester: string;
  scheduleInfo?: string;
  capacity: number;
  professorId?: number;
}

export interface UpdateCourseRequest {
  title: string;
  description?: string;
  semester: string;
  scheduleInfo?: string;
  capacity: number;
  professorId?: number;
}

export interface PaginatedCourseResponse {
  content: CourseResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Legacy Course type for backward compatibility
export interface Course {
  id: number;
  code: string;
  title: string;
  description?: string;
  semester: string;
  scheduleInfo?: string;
  capacity: number;
  availableSeats: number;
  professor?: {
    id: number;
    user: {
      name: string;
      email: string;
    };
  };
}

export const courseService = {
  // Get all courses with pagination
  getAllCourses: async (
    page: number = 0,
    size: number = 10,
    sortBy: string = 'id',
    sortDir: string = 'asc'
  ): Promise<PaginatedCourseResponse> => {
    const response = await api.get(`/courses`, {
      params: { page, size, sortBy, sortDir }
    });
    return response.data;
  },

  // Get all courses without pagination (for dropdowns, etc.)
  getAllCoursesSimple: async (): Promise<CourseResponse[]> => {
    const response = await api.get('/courses/simple');
    return response.data;
  },

  // Legacy method for backward compatibility
  getAllCoursesLegacy: async (): Promise<Course[]> => {
    const response = await api.get('/courses/simple');
    return response.data;
  },

  // Get course by ID
  getCourseById: async (id: number): Promise<CourseResponse> => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  // Get courses by semester
  getCoursesBySemester: async (semester: string): Promise<CourseResponse[]> => {
    const response = await api.get(`/courses/semester/${semester}`);
    return response.data;
  },

  // Get courses by professor
  getCoursesByProfessor: async (professorId: number): Promise<CourseResponse[]> => {
    const response = await api.get(`/courses/professor/${professorId}`);
    return response.data;
  },

  // Search courses
  searchCourses: async (
    search?: string,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedCourseResponse> => {
    const response = await api.get('/courses/search', {
      params: { search, page, size }
    });
    return response.data;
  },

  // Create new course
  createCourse: async (courseData: CreateCourseRequest): Promise<CourseResponse> => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },

  // Update course
  updateCourse: async (id: number, courseData: UpdateCourseRequest): Promise<CourseResponse> => {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
  },

  // Delete course
  deleteCourse: async (id: number): Promise<void> => {
    await api.delete(`/courses/${id}`);
  }
};