import api from './api';

export interface ProfessorCourse {
  id: number;
  code: string;
  title: string;
  description: string;
  semester: string;
  capacity: number;
  availableSeats: number;
  scheduleInfo: string;
  enrolledStudents: number;
}

export interface CourseRosterStudent {
  id: number;
  studentId: string;
  name: string;
  email: string;
  enrollmentDate: string;
  grade?: string;
  enrollmentId: number;
}

export interface CourseRoster {
  courseId: number;
  courseCode: string;
  courseTitle: string;
  semester: string;
  students: CourseRosterStudent[];
  totalEnrolled: number;
}

export interface GradeUpdateRequest {
  enrollmentId: number;
  grade: string;
}

export interface ProfessorStats {
  totalCourses: number;
  totalStudents: number;
  coursesThisSemester: number;
  pendingGrades: number;
}

export const professorService = {
  // Get professor's assigned courses
  getMyCourses: async (): Promise<ProfessorCourse[]> => {
    const response = await api.get('/professor/my-courses');
    return response.data;
  },

  // Get course roster for a specific course
  getCourseRoster: async (courseId: number): Promise<CourseRoster> => {
    const response = await api.get(`/professor/course/${courseId}/roster`);
    return response.data;
  },

  // Update student grade
  updateGrade: async (request: GradeUpdateRequest): Promise<void> => {
    await api.put(`/enrollments/${request.enrollmentId}/grade`, {
      grade: request.grade
    });
  },

  // Update multiple grades at once
  updateMultipleGrades: async (grades: GradeUpdateRequest[]): Promise<void> => {
    await api.post('/enrollments/bulk-grade-update', { grades });
  },

  // Get professor dashboard statistics
  getStats: async (): Promise<ProfessorStats> => {
    const response = await api.get('/professor/stats');
    return response.data;
  },

  // Update course details (limited fields for professors)
  updateCourseDetails: async (courseId: number, updates: {
    description?: string;
    scheduleInfo?: string;
  }): Promise<void> => {
    await api.put(`/professor/course/${courseId}`, updates);
  }
};
