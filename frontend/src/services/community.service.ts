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
