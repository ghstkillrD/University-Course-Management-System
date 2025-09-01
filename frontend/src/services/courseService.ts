import api from './api';

export interface Course {
  id: number;
  code: string;
  title: string;
  description: string;
  semester: string;
  scheduleInfo: string;
  capacity: number;
  availableSeats: number;
  professor?: {
    id: number;
    name: string;
    email: string;
    department: string;
  };
}

export const courseService = {
  getAllCourses: async (): Promise<Course[]> => {
    const response = await api.get('/courses');
    return response.data;
  },

  getCourseById: async (id: number): Promise<Course> => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  getCoursesBySemester: async (semester: string): Promise<Course[]> => {
    const response = await api.get(`/courses/semester/${semester}`);
    return response.data;
  },
};