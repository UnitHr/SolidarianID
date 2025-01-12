import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { envs } from 'src/config';

@Injectable()
export class ReportService {
  async getCommunities(token: string) {
    try {
      const response = await axios.get(envs.communityMsBaseUrl, {
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
        envs.statisticsMsBaseUrl + `/community/${communityId}/report`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
      /*const fileContent = readFileSync(
        '../frontend/src/modules/reports/community.json',
        'utf-8',
      );
      const data = JSON.parse(fileContent);
      return data;*/
    } catch (error) {
      console.error('Error fetching communities details:', error);
      return [];
    }
  }
}
