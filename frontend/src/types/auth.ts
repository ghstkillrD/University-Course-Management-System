export interface UserInfo {
  id: number;
  username: string;
  role: 'STUDENT' | 'PROFESSOR' | 'ADMIN';
  profileId: number;
  name: string;
  email: string;
}

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

export interface LoginResponse {
  token: string;
  type: string;
  user: UserInfo;
}
