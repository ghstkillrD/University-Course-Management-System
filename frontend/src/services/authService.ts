import api from './api';
import type { LoginRequest, RegisterRequest, UserInfo, LoginResponse } from '../types/auth';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      console.log('Attempting login with:', credentials.username);
      const response = await api.post('/auth/login', credentials);
      console.log('Login response:', response);
      return response.data;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
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