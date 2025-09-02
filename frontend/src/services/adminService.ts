// User management API endpoints
import api from './api';

export interface CreateUserRequest {
  username: string;
  password: string;
  role: 'STUDENT' | 'PROFESSOR' | 'ADMIN';
  name: string;
  email: string;
  studentId?: string;
  employeeId?: string;
  department?: string;
  dateOfBirth?: string;
}

export interface UpdateUserRequest {
  username: string;
  password?: string; // Optional for updates
  role: 'STUDENT' | 'PROFESSOR' | 'ADMIN';
  name: string;
  email: string;
  studentId?: string;
  employeeId?: string;
  department?: string;
  dateOfBirth?: string;
}

export interface UserResponse {
  id: number;
  username: string;
  role: string;
  name: string;
  email: string;
  studentId?: string;
  employeeId?: string;
  department?: string;
  dateOfBirth?: string;
  createdAt: string;
  active: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface SystemStats {
  totalUsers: number;
  totalStudents: number;
  totalProfessors: number;
  totalAdmins: number;
}

export const adminService = {
  // User Management
  getAllUsers: (page = 0, size = 10, role?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (role) params.append('role', role);
    
    return api.get<PaginatedResponse<UserResponse>>(`/admin/users?${params}`);
  },

  getUserById: (userId: number) => 
    api.get<UserResponse>(`/admin/users/${userId}`),

  createUser: (userData: CreateUserRequest) => 
    api.post<UserResponse>('/admin/users', userData),

  updateUser: (userId: number, userData: UpdateUserRequest) => 
    api.put<UserResponse>(`/admin/users/${userId}`, userData),

  deleteUser: (userId: number) => 
    api.delete(`/admin/users/${userId}`),

  // Student Management
  getAllStudents: (page = 0, size = 10) => 
    api.get<PaginatedResponse<UserResponse>>(`/admin/students?page=${page}&size=${size}`),

  // Professor Management
  getAllProfessors: (page = 0, size = 10) => 
    api.get<PaginatedResponse<UserResponse>>(`/admin/professors?page=${page}&size=${size}`),

  // System Statistics
  getSystemStats: () => 
    api.get<SystemStats>('/admin/stats'),
};
