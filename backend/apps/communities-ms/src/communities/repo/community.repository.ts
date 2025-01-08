import { Repository } from '@common-lib/common-lib/core/repository';
import * as Domain from '../domain';
import {
  CommunityFilter,
  PaginationParams,
} from '../infra/filters/community-query.builder';

export abstract class CommunityRepository extends Repository<Domain.Community> {
  abstract findByName(name: string): Promise<Domain.Community>;

  abstract isCommunityAdmin(
    userId: string,
    communityId: string,
  ): Promise<boolean>;

  abstract findAll(
    filter: CommunityFilter,
    pagination: PaginationParams,
  ): Promise<Domain.Community[]>;

  abstract countDocuments(filter: CommunityFilter): Promise<number>;
}
