import { Repository } from '@common-lib/common-lib/core/repository';
import * as Domain from '../domain';
import { PaginationParams } from '@communities-ms/causes/infra/filters/cause-query.builder';

export abstract class JoinCommunityRequestRepository extends Repository<Domain.JoinCommunityRequest> {
  abstract findAll(
    communityId: string,
    pagination: PaginationParams,
  ): Promise<Domain.JoinCommunityRequest[]>;

  abstract findByUserIdAndCommunityId(
    userId: string,
    communityId: string,
  ): Promise<Domain.JoinCommunityRequest>;

  abstract countDocuments(communityId: string): Promise<number>;
}
