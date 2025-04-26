import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { envs } from '@api-gateway/config';
import { CommunityService } from '@api-gateway/graphql/application/community.service';

@Injectable()
export class CommunityServiceImpl implements CommunityService {
  private readonly communityMsUrl = envs.communitiesMsUrl;

  async getCommunity(id: string) {
    const response = await axios.get(`${this.communityMsUrl}/${id}`);
    return response.data.data;
  }
}
