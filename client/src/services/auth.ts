/**
 * Authentication API Service
 * Handles communication with the authentication backend (Node.js server on port 4000)
 */

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:4000/api';

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'USER' | 'ADMIN';
  plan: {
    name: string;
    type: 'FREE' | 'PAID' | 'PREMIUM';
    conversionLimit: number;
    templatesAccess: number;
  };
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserStats {
  totalConversions: number;
  totalPpts: number;
  thisMonthConversions: number;
  recentActivity: Array<{
    id: string;
    inputFilename: string;
    outputFilename: string;
    createdAt: string;
  }>;
}

export interface AdminStats {
  totalUsers: number;
  totalPpts: number;
  totalConversions: number;
  newUsersThisMonth: number;
  usersByPlan: { planType: string; _count: { id: number } }[];
  recentUsers: User[];
}

export class AuthApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AuthApiError';
  }
}

/**
 * Get stored auth token
 */
export function getToken(): string | null {
  return localStorage.getItem('authToken');
}

/**
 * Set auth token
 */
export function setToken(token: string): void {
  localStorage.setItem('authToken', token);
}

/**
 * Remove auth token
 */
export function removeToken(): void {
  localStorage.removeItem('authToken');
}

/**
 * Make authenticated API request
 */
async function authFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${AUTH_API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });
  
  return response;
}

/**
 * Handle API response
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new AuthApiError(
      errorData.error || 'Request failed',
      response.status,
      errorData
    );
  }
  return response.json();
}

// ============ AUTH ENDPOINTS ============

/**
 * Register a new user
 */
export async function register(
  email: string,
  password: string,
  name?: string
): Promise<AuthResponse> {
  const response = await authFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
  
  const data = await handleResponse<AuthResponse>(response);
  setToken(data.token);
  return data;
}

/**
 * Login user
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await authFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  const data = await handleResponse<AuthResponse>(response);
  setToken(data.token);
  return data;
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    await authFetch('/auth/logout', { method: 'POST' });
  } finally {
    removeToken();
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User> {
  const response = await authFetch('/auth/me');
  const data = await handleResponse<{ user: User }>(response);
  return data.user;
}

/**
 * Verify token is valid
 */
export async function verifyToken(): Promise<boolean> {
  try {
    const response = await authFetch('/auth/verify');
    const data = await handleResponse<{ valid: boolean }>(response);
    return data.valid;
  } catch {
    return false;
  }
}

/**
 * Update password
 */
export async function updatePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> {
  const response = await authFetch('/auth/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return handleResponse(response);
}

// ============ USER ENDPOINTS ============

/**
 * Get user profile
 */
export async function getProfile(): Promise<User> {
  const response = await authFetch('/users/profile');
  return handleResponse(response);
}

/**
 * Update user profile
 */
export async function updateProfile(data: {
  name?: string;
  email?: string;
}): Promise<User> {
  const response = await authFetch('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

/**
 * Get available plans
 */
export async function getPlans(): Promise<Array<{
  id: string;
  name: string;
  type: string;
  price: number;
  conversionLimit: number;
  templatesAccess: number;
}>> {
  const response = await authFetch('/users/plans');
  return handleResponse(response);
}

/**
 * Upgrade user plan
 */
export async function upgradePlan(planName: string): Promise<{ message: string; user: User }> {
  const response = await authFetch('/users/upgrade', {
    method: 'POST',
    body: JSON.stringify({ planName }),
  });
  return handleResponse(response);
}

// ============ HISTORY ENDPOINTS ============

/**
 * Get user's conversion history
 */
export async function getHistory(
  page = 1,
  limit = 10
): Promise<PaginatedResponse<{
  id: string;
  inputFilename: string;
  outputFilename: string;
  status: string;
  createdAt: string;
}>> {
  const response = await authFetch(`/history?page=${page}&limit=${limit}`);
  return handleResponse(response);
}

/**
 * Get user stats
 */
export async function getUserStats(): Promise<UserStats> {
  const response = await authFetch('/history/stats');
  return handleResponse(response);
}

/**
 * Delete history entry
 */
export async function deleteHistoryEntry(id: string): Promise<{ message: string }> {
  const response = await authFetch(`/history/${id}`, { method: 'DELETE' });
  return handleResponse(response);
}

// ============ PPT ENDPOINTS ============

/**
 * Get user's PPTs
 */
export async function getPpts(
  page = 1,
  limit = 10
): Promise<PaginatedResponse<{
  id: string;
  title: string;
  templateId: string | null;
  createdAt: string;
  updatedAt: string;
}>> {
  const response = await authFetch(`/ppt?page=${page}&limit=${limit}`);
  return handleResponse(response);
}

/**
 * Get single PPT
 */
export async function getPpt(id: string): Promise<{
  id: string;
  title: string;
  slideJson: unknown;
  templateId: string | null;
  pdfPath: string | null;
  texPath: string | null;
}> {
  const response = await authFetch(`/ppt/${id}`);
  return handleResponse(response);
}

/**
 * Save a new PPT
 */
export async function savePpt(data: {
  title: string;
  slideJson: unknown;
  templateId?: string;
  pdfPath?: string;
  texPath?: string;
}): Promise<{ id: string }> {
  const response = await authFetch('/ppt', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

/**
 * Update PPT
 */
export async function updatePpt(
  id: string,
  data: {
    title?: string;
    slideJson?: unknown;
    templateId?: string;
  }
): Promise<{ id: string }> {
  const response = await authFetch(`/ppt/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

/**
 * Delete PPT
 */
export async function deletePpt(id: string): Promise<{ message: string }> {
  const response = await authFetch(`/ppt/${id}`, { method: 'DELETE' });
  return handleResponse(response);
}

// ============ ADMIN ENDPOINTS ============

/**
 * Get admin dashboard stats
 */
export async function getAdminDashboard(): Promise<AdminStats> {
  const response = await authFetch('/admin/dashboard');
  return handleResponse(response);
}

/**
 * Get all users (admin only)
 */
export async function getAdminUsers(
  page = 1,
  limit = 20,
  search = ''
): Promise<PaginatedResponse<User>> {
  const response = await authFetch(
    `/admin/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
  );
  return handleResponse(response);
}

/**
 * Get user details (admin only)
 */
export async function getAdminUserDetails(
  userId: string
): Promise<User & { history: unknown[]; ppts: unknown[] }> {
  const response = await authFetch(`/admin/users/${userId}`);
  return handleResponse(response);
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(
  userId: string,
  role: 'USER' | 'ADMIN'
): Promise<{ message: string; user: User }> {
  const response = await authFetch(`/admin/users/${userId}/role`, {
    method: 'PUT',
    body: JSON.stringify({ role }),
  });
  return handleResponse(response);
}

/**
 * Delete user (admin only)
 */
export async function deleteUser(userId: string): Promise<{ message: string }> {
  const response = await authFetch(`/admin/users/${userId}`, { method: 'DELETE' });
  return handleResponse(response);
}
