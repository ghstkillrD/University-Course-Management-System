import api from './api';
import type { Course } from '../types/course';

// Re-export for backward compatibility
export type { Course };

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