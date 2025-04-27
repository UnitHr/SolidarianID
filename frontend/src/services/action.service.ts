import {
  ActionDetails,
  ActionStatusEnum,
  ActionTypeEnum,
  CreateContributionPayload,
  FetchActionsResponse,
} from '../lib/types/action.types';
import { getToken } from './user.service';

const API_URL = 'http://localhost:3000/api/v1/actions';

/**
 * Fetch paginated and filtered actions.
 */
export async function fetchActions(
  page = 1,
  limit = 10,
  name = '',
  status = '',
  sortBy = 'title',
  sortDirection = 'asc'
): Promise<FetchActionsResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
    sortDirection,
  });

  if (name.trim()) params.append('name', name);
  if (status.trim()) params.append('status', status);

  const response = await fetch(`${API_URL}?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch actions');

  return await response.json();
}

/**
 * Fetch a single action by its ID.
 */
export async function fetchActionById(actionId: string): Promise<ActionDetails> {
  const response = await fetch(`${API_URL}/${actionId}`);
  if (!response.ok) throw new Error('Error fetching action details');

  const data = await response.json();

  return {
    ...data,
    status: data.status as ActionStatusEnum,
    type: data.type as ActionTypeEnum,
  };
}

/**
 * Contribute to an action.
 */
export async function contributeAction(actionId: string, payload: CreateContributionPayload) {
  const token = getToken();

  const response = await fetch(`${API_URL}/${actionId}/contributions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create contribution');
  }

  return response.json();
}
