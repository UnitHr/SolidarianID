import {
  FetchCommunitiesResponse,
  CommunityDetails,
  CreateCommunityRequestPayload,
} from '../lib/types/community.types';
import { CauseDetails } from '../lib/types/cause.types';
import { getToken } from './user.service';

const API_URL = 'http://localhost:3000/api/v1';
const COMMUNITY_URL = `${API_URL}/communities`;

/**
 * Fetch paginated communities optionally filtered by name.
 */
export async function fetchCommunities(
  page = 1,
  limit = 10,
  name = ''
): Promise<FetchCommunitiesResponse> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (name.trim()) {
    params.append('name', name);
  }

  const response = await fetch(`${COMMUNITY_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Error fetching communities');
  }
  return await response.json();
}

/**
 * Approve a community creation request by its ID.
 */
export async function approveCommunityRequest(requestId: string): Promise<boolean> {
  const token = getToken();
  if (!token) throw new Error('No token available');

  try {
    const response = await fetch(`${COMMUNITY_URL}/creation-requests/${requestId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: 'approved' }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error approving community request:', error);
    return false;
  }
}

/**
 * Reject a community creation request with a comment.
 */
export async function rejectCommunityRequest(requestId: string, comment: string): Promise<boolean> {
  const token = getToken();
  if (!token) throw new Error('No token available');

  try {
    const response = await fetch(`${COMMUNITY_URL}/creation-requests/${requestId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: 'denied', comment }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error rejecting community request:', error);
    return false;
  }
}

/**
 * Get detailed data for a single community.
 */
export async function getCommunityById(communityId: string): Promise<CommunityDetails> {
  const response = await fetch(`${COMMUNITY_URL}/${communityId}`);
  if (!response.ok) {
    throw new Error('Error fetching community details');
  }
  const data = await response.json();
  return data.data;
}

/**
 * Fetch all causes IDs for a community and return detailed cause data.
 */
export async function getCommunityCauses(
  communityId: string,
  page = 1,
  limit = 6
): Promise<CauseDetails[]> {
  const response = await fetch(
    `${COMMUNITY_URL}/${communityId}/causes?page=${page}&limit=${limit}`
  );
  if (!response.ok) {
    throw new Error('Error fetching community causes');
  }
  const data = await response.json();

  const detailRequests = data.data.map((id: string) =>
    fetch(`${API_URL}/causes/${id}`).then((res) => res.json())
  );
  return Promise.all(detailRequests);
}

/**
 * Get total pages for paginated causes inside a community.
 */
export async function getTotalCausesPages(communityId: string, limit = 10): Promise<number> {
  const response = await fetch(`${COMMUNITY_URL}/${communityId}/causes?page=1&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Error fetching total causes pages');
  }
  const data = await response.json();
  return data.meta.totalPages;
}

/**
 * Fetch recursively all member IDs in a community.
 */
export async function getCommunityMembers(communityId: string): Promise<string[]> {
  let page = 1;
  const pageLimit = 10;
  let allMembers: string[] = [];
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await fetch(
      `${COMMUNITY_URL}/${communityId}/members?page=${page}&limit=${pageLimit}`
    );
    if (!response.ok) {
      throw new Error('Error fetching community members');
    }

    const data = await response.json();
    allMembers = [...allMembers, ...data.data];
    hasNextPage = data.meta.hasNextPage;
    page++;
  }

  return allMembers;
}

/**
 * Send a join request to a community.
 */
export async function sendJoinRequest(communityId: string): Promise<Response> {
  const token = getToken();
  if (!token) throw new Error('No token available');

  return fetch(`${COMMUNITY_URL}/${communityId}/join-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Send a new community creation request.
 */
export async function createCommunityRequest(
  payload: CreateCommunityRequestPayload
): Promise<void> {
  const token = getToken();

  const response = await fetch(`${API_URL}/communities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to create community request');
  }
}
