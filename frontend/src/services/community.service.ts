export interface Community {
  id: string;
  adminId: string;
  name: string;
  description: string;
}

export interface FetchCommunitiesResponse {
  data: Community[];
  meta: { totalPages: number };
}

export async function fetchCommunities(
  page: number = 1,
  limit: number = 10,
  name: string = ''
): Promise<FetchCommunitiesResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (name?.trim()) {
    params.append('name', name);
  }

  const url = `http://localhost:3000/api/v1/communities?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Error fetching communities');
  }

  return await response.json();
}

const baseUrl = 'http://localhost:3000/api/v1/communities';
const jwtToken = localStorage.getItem('token') || '';

export const approveCommunityRequest = async (requestId: string) => {
  try {
    const response = await fetch(`${baseUrl}/creation-requests/${requestId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({ status: 'approved' }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error approving request:', error);
    return false;
  }
};

export const rejectCommunityRequest = async (requestId: string, comment: string) => {
  try {
    const response = await fetch(`${baseUrl}/creation-requests/${requestId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({ status: 'denied', comment }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error rejecting request:', error);
    return false;
  }
};
