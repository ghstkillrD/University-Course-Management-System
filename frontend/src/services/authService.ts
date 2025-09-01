import api from './api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  studentId: string;
  name: string;
  email: string;
  dateOfBirth: string;
}

export interface UserInfo {
  id: number;
  username: string;
  role: 'STUDENT' | 'PROFESSOR' | 'ADMIN';
  profileId: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  user: UserInfo;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<UserInfo> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async (): Promise<UserInfo> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};