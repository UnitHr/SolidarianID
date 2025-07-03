import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { envs } from 'src/config';

@Injectable()
export class ValidationService {
  async getCreateCommunityRequests(page: number, limit: number, token: string) {
    try {
      const response = await axios.get(
        envs.communityMsBaseUrl + '/creation-requests',
        {
          params: {
            status: 'pending',
            page: page,
            limit: limit,
          },
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return { data: response.data.data, pagination: response.data.meta };
    } catch (error) {
      console.error('Error fetching community requests:', error);
      return { data: [], total: 0 };
    }
  }

  async validateRequests(requestIds: string, token: string) {
    const selectedRequests = JSON.parse(requestIds);

    for (const requestId of selectedRequests) {
      try {
        await axios.post(
          envs.communityMsBaseUrl + `/creation-requests/${requestId}`,
          {
            status: 'approved',
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      } catch (error) {
        console.error(`Error validating request ${requestId}:`, error.message);
      }
    }
  }

  async rejectRequest(requestId: string, reason: string, token: string) {
    try {
      await axios.post(
        envs.communityMsBaseUrl + `/creation-requests/${requestId}`,
        {
          status: 'denied',
          comment: reason,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (error) {
      console.error(`Error validating request ${requestId}:`, error.message);
    }
  }
}
