export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned'
}

export interface User {
  user_id: number;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  last_login: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface UserProgress {
  progress_id: number;
  user_id: number;
  exercise_id: number;
  status: 'not_started' | 'in_progress' | 'completed';
  score: number;
  attempts: number;
  last_attempt_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
} 