import { CreateCausePayload } from '../lib/types/cause.types';
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
