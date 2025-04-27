import { jwtDecode } from 'jwt-decode';
import { User, RegisterPayload } from '../lib/types/user.types';
import { enableNotifications } from './push-notification.service';

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
  enableNotifications();

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

/**
 * Fetch user by ID.
 */
export async function fetchUserById(userId: string): Promise<User> {
  const res = await fetch(`${API_URL}/users/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch creator');
  return res.json();
}

/**
 * Get a user name by id.
 */
export const getUserNameById = async (userId: string) => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found. Please login.');
  }

  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    const data = await response.json();
    return data.firstName + ' ' + data.lastName;
  } catch (error) {
    console.error('Error getting user name:', error);
    throw error;
  }
};

/**
 * Follow a user.
 */
export async function followUser(followedId: string): Promise<void> {
  const token = getToken();
  if (!token) {
    throw new Error('No token found. Please login.');
  }

  const response = await fetch(`${API_URL}/users/${followedId}/followers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to follow user');
  }
}
