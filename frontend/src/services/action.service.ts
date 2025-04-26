import {
  ActionDetails,
  ActionStatusEnum,
  ActionTypeEnum,
  FetchActionsResponse,
} from '../lib/types/action.types';

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
