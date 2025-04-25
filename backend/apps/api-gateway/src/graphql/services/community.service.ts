import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { envs } from '@api-gateway/config';

@Injectable()
export class CommunityService {
  private readonly communityMsUrl = envs.communitiesMsUrl;

  async getCommunity(id: string) {
    try {
      const response = await axios.get(`${this.communityMsUrl}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch community: ${error.message}`);
    }
  }
}
