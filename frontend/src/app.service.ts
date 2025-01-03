import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Constants } from './common/constants';

@Injectable()
export class AppService {
  async getCreateCommunityRequests(offset: number, limit: number) {
    try {
      const response = await axios.get(
        Constants.COMMUNITY_MS_BASE_URL + '/creation-requests',
        {
          params: { offset, limit },
        },
      );
      console.log('Community requests:', response.data);
      // Data and total
      return { data: response.data.data, total: response.data.total };
    } catch (error) {
      console.error('Error fetching community requests:', error);
      // In case of error, return an empty array
      return { data: [], total: 0 };
    }
  }
}
