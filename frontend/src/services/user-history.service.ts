import {
  Following,
  Follower,
  HistoryEntry,
  PaginatedResponse,
} from '../lib/types/user-history.types';
import { getToken } from './user.service';

const API_URL = 'http://localhost:3000/api/v1';

/**
 * Fetches user history data from the API.
 */
async function authFetch<T>(path: string): Promise<PaginatedResponse<T>> {
  const token = getToken();
  if (!token) throw new Error('No user token found');

  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Error fetching ${path}`);
  }

  return res.json();
}

/**
 * Fetches data
 */
export const fetchFollowing = (userId: string, page = 1, limit = 6) =>
  authFetch<Following>(`/users/${userId}/following?page=${page}&limit=${limit}`);

export const fetchFollowers = (userId: string, page = 1, limit = 6) =>
  authFetch<Follower>(`/users/${userId}/followers?page=${page}&limit=${limit}`);

export const fetchCommunitiesHistory = (userId: string, page = 1, limit = 6) =>
  authFetch<HistoryEntry>(
    `/users/${userId}/history?type=JOINED_COMMUNITY&page=${page}&limit=${limit}`
  );

export const fetchCausesHistory = (userId: string, page = 1, limit = 6) =>
  authFetch<HistoryEntry>(
    `/users/${userId}/history?type=CAUSE_SUPPORT&page=${page}&limit=${limit}`
  );

export const fetchSupportsHistory = (userId: string, page = 1, limit = 6) =>
  authFetch<HistoryEntry>(
    `/users/${userId}/history?type=ACTION_CONTRIBUTED&page=${page}&limit=${limit}`
  );

export const fetchRequestsHistory = (userId: string, page = 1, limit = 6) =>
  authFetch<HistoryEntry>(
    `/users/${userId}/history?type=JOIN_COMMUNITY_REQUEST_SENT&status=PENDING&page=${page}&limit=${limit}`
  );
