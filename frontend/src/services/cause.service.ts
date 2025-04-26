import { ActionDetails, CreateActionPayload } from '../lib/types/action.types';
import { CauseDetails, CreateCausePayload, FetchCausesResponse } from '../lib/types/cause.types';
import { ODSEnum } from '../utils/ods';
import { getToken } from './user.service';

const API_URL = 'http://localhost:3000/api/v1';

/**
 * Create a new cause inside a community.
 */
export async function createCause(communityId: string, payload: CreateCausePayload): Promise<void> {
  const token = getToken();

  const response = await fetch(`${API_URL}/communities/${communityId}/causes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to create cause');
  }
}

/**
 * Fetch paginated causes with optional filters.
 */
export async function fetchCauses(
  page = 1,
  limit = 10,
  name = '',
  ods: ODSEnum[] = [],
  sortBy = 'title',
  sortDirection = 'asc'
): Promise<FetchCausesResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
    sortDirection,
  });

  if (name.trim()) params.append('name', name);
  if (ods.length > 0) params.append('ods', ods.join(','));

  const response = await fetch(`${API_URL}/causes?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch causes');
  }

  return await response.json();
}

/**
 * Fetch a cause by its ID.
 */
export async function fetchCauseById(causeId: string): Promise<CauseDetails> {
  const response = await fetch(`${API_URL}/causes/${causeId}`);
  if (!response.ok) throw new Error('Error fetching cause details');
  const data = await response.json();
  return data;
}

/**
 * Create a new action under a cause.
 */
export async function createAction(causeId: string, payload: CreateActionPayload): Promise<void> {
  const token = getToken();

  const response = await fetch(`${API_URL}/causes/${causeId}/actions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to create action');
  }
}

/**
 * Fetch actions by cause ID with pagination.
 */
export async function fetchCauseSupporters(causeId: string): Promise<string[]> {
  const res = await fetch(`${API_URL}/causes/${causeId}/supporters`);
  if (!res.ok) throw new Error('Failed to fetch supporters');
  const data = await res.json();
  return data.data;
}

/**
 * Fetch actions by cause ID with pagination.
 */
export async function fetchActionsByCauseId(
  causeId: string,
  page = 1,
  limit = 10
): Promise<{ actions: ActionDetails[]; totalPages: number }> {
  const res = await fetch(`${API_URL}/causes/${causeId}/actions?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch actions for cause');
  const data = await res.json();

  const detailRequests = data.data.map((id: string) =>
    fetch(`${API_URL}/actions/${id}`).then((res) => res.json())
  );
  const entityDetails = await Promise.all(detailRequests);

  return {
    actions: entityDetails,
    totalPages: data.meta.totalPages,
  };
}

/**
 * Support a cause by its ID.
 */
export async function supportCause(causeId: string): Promise<void> {
  const token = getToken();

  const res = await fetch(`${API_URL}/causes/${causeId}/supporters`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to support the cause');
}
