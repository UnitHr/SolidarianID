import { StatusRequest } from '../domain/StatusRequest';

export class JoinCommunityRequestDto {
  id: string;

  userId: string;

  communityId: string;

  communityName: string;

  status: StatusRequest;

  comment?: string;
}
