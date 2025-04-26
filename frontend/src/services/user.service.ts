import { jwtDecode } from 'jwt-decode';
import { User, RegisterPayload } from '../lib/types/user.types';

const API_URL = 'http://localhost:3000/api/v1';
const STORAGE_TOKEN_KEY = 'token';
const STORAGE_USER_KEY = 'user';

/**
 * Login user, fetch user data and save tokens automatically.
 */
export async function loginUser(email: string, password: string): Promise<User> {
  const response = await fetch(`${API_URL}/users/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error('Invalid credentials');

  const data = await response.json();

  const payload = jwtDecode<{
    email: string;
    sub: { value: string };
    roles: string;
    exp: number;
  }>(data.access_token);

  const userId = payload.sub?.value;
  if (!userId) throw new Error('Invalid user ID');

  const userResponse = await fetch(`${API_URL}/users/${userId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data.access_token}`,
    },
  });

  if (!userResponse.ok) throw new Error('Failed to fetch user data');

  const userDataApi = await userResponse.json();

  const userData: User = {
    userId,
    firstName: userDataApi.firstName,
    lastName: userDataApi.lastName,
    roles: payload.roles,
    token: data.access_token,
    exp: payload.exp,
  };

  // Save token and user data to localStorage
  localStorage.setItem(STORAGE_TOKEN_KEY, userData.token);
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userData));

  return userData;
}

/**
 * Register a new user.
 */
export async function registerUser(payload: RegisterPayload): Promise<void> {
  const body = {
    ...payload,
    birthDate: new Date(payload.birthDate),
  };

  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error during registration');
  }
}

/**
 * Clear saved auth data.
 */
export function clearAuthData() {
  localStorage.removeItem(STORAGE_TOKEN_KEY);
  localStorage.removeItem(STORAGE_USER_KEY);
}

/**
 * Get current token.
 */
export function getToken(): string | null {
  return localStorage.getItem(STORAGE_TOKEN_KEY);
}

/**
 * Get current stored user.
 */
export function getStoredUser(): User | null {
  const user = localStorage.getItem(STORAGE_USER_KEY);
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}
