import api from './api';

export interface EnrollmentRequest {
  courseId: number;
}

export interface EnrollmentResponse {
  id: number;
  studentId: number;
  courseId: number;
  course: {
    id: number;
    code: string;
    title: string;
    semester: string;
    professor?: {
      name: string;
    };
  };
  enrollmentDate: string;
  grade?: string;
}

export interface StudentScheduleResponse {
  enrollments: EnrollmentResponse[];
  totalCredits: number;
  gpa?: number;
}

export interface TranscriptResponse {
  studentId: number;
  studentName: string;
  email: string;
  major: string;
  gpa?: number;
  totalCredits: number;
  completedCredits: number;
  courses: TranscriptEntry[];
}

export interface TranscriptEntry {
  courseCode: string;
  courseTitle: string;
  semester: string;
  grade: string;
  credits: number;
  professorName: string;
}

export const enrollmentService = {
  // Enroll student in a course
  enrollInCourse: async (courseId: number): Promise<EnrollmentResponse> => {
    const response = await api.post('/enrollments/enroll', { courseId });
    return response.data;
  },

  // Drop a course
  dropCourse: async (courseId: number): Promise<void> => {
    await api.delete(`/enrollments/drop/${courseId}`);
  },

  // Get student's current schedule
  getMySchedule: async (): Promise<StudentScheduleResponse> => {
    const response = await api.get('/enrollments/my-schedule');
    return response.data;
  },

  // Get student's transcript
  getMyTranscript: async (): Promise<TranscriptResponse> => {
    const response = await api.get('/enrollments/my-transcript');
    return response.data;
  },

  // Get enrollments by student (for admin/self)
  getStudentEnrollments: async (studentId: number): Promise<EnrollmentResponse[]> => {
    const response = await api.get(`/enrollments/student/${studentId}`);
    return response.data;
  },

  // Get student transcript (for admin/self)
  getStudentTranscript: async (studentId: number): Promise<TranscriptResponse> => {
    const response = await api.get(`/enrollments/transcript/${studentId}`);
    return response.data;
  }
};
