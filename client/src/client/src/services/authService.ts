// client/src/services/authService.ts
import { get, post } from './apiService';
import { User } from '../types/user';

interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Register a new user
 */
export const register = async (userData: {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}): Promise<AuthResponse> => {
  return post<AuthResponse>('/auth/register', userData);
};

/**
 * Log in an existing user
 */
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  return post<AuthResponse>('/auth/login', { email, password });
};

/**
 * Log out the current user
 */
export const logout = async (): Promise<{ message: string }> => {
  return post<{ message: string }>('/auth/logout');
};

/**
 * Get the current authenticated user
 */
export const getCurrentUser = async (): Promise<{ user: User }> => {
  return get<{ user: User }>('/auth/user');
};

/**
 * Change user password
 */
export const changePassword = async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
  return post<{ message: string }>('/auth/password', { currentPassword, newPassword });
};

/**
 * Refresh the authentication token
 */
export const refreshToken = async (): Promise<{ token: string }> => {
  return post<{ token: string }>('/auth/refresh');
};

/**
 * Update user profile
 */
export const updateProfile = async (userData: Partial<User>): Promise<{ user: User }> => {
  return post<{ user: User }>('/auth/profile', userData);
};