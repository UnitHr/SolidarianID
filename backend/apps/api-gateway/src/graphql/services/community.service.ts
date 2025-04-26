import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { envs } from '@api-gateway/config';

@Injectable()
export class CommunityService {
  private readonly communityMsUrl = envs.communitiesMsUrl;

  private readonly logger = new Logger(CommunityService.name);

  async getCommunity(id: string) {
    const response = await axios.get(`${this.communityMsUrl}/${id}`);
    return response.data;
  }
}
