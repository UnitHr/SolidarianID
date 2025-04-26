import { CommunityModel } from '../models/community.model';

export abstract class CommunityService {
  abstract getCommunity(id: string): Promise<CommunityModel>;
}
