import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { readFileSync } from 'fs';
import { Constants } from 'src/common/constants';

@Injectable()
export class ReportService {
  async getCommunities(token: string) {
    try {
      const response = await axios.get(Constants.COMMUNITY_MS_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching communities:', error);
      return [];
    }
  }

  async getCommunityDetails(token: string, communityId: string) {
    try {
      const response = await axios.get(
        Constants.STATISTICS_MS_BASE_URL + `/community/community_004/report`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching communities details:', error);
      return [];
    }
  }
}
