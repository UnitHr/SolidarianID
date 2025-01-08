import { Injectable } from '@nestjs/common';
import { CommunityReportsService } from './community-reports.service';
import CommunityByCommunityIdRepository from '../infra/community-by-community-id.repository.cassandra';
import CauseByCommunityIdRepository from '../infra/cause-by-community-id.repository.cassandra';
import ActionByCommunityIdRepository from '../infra/action-by-community-id.repository.cassandra';
import * as Domain from '../domain';

@Injectable()
export class CommunityReportsServiceImpl implements CommunityReportsService {
  constructor(
    private readonly communityByCommunityIdRepository: CommunityByCommunityIdRepository,
    private readonly causeByCommunityIdRepository: CauseByCommunityIdRepository,
    private readonly actionByCommunityIdRepository: ActionByCommunityIdRepository,
  ) {}

  findOne(id: string): Promise<Domain.CommunityReport> {
    return Promise.all([
      this.communityByCommunityIdRepository.findOneByCommunityId(id),
      this.causeByCommunityIdRepository.findManyByCommunityId(id),
      this.actionByCommunityIdRepository.findManyByCommunityId(id),
    ]).then(([community, cause, action]) => {
      return Domain.CommunityReport.create(community, cause, action);
    });
  }
}
