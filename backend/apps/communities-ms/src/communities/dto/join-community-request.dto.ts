import { StatusRequest } from '../domain/StatusRequest';

export class JoinCommunityRequestDto {
  id: string;

  userId: string;

  communityId: string;

  status: StatusRequest;

  comment?: string;
}
