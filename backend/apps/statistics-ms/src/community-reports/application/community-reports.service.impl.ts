import { Injectable } from '@nestjs/common';
import { CommunityReportsService } from './community-reports.service';
import CommunityByCommunityIdRepository from '../infra/community-by-community-id.repository.cassandra';
import CauseByCommunityIdRepository from '../infra/cause-by-community-id.repository.cassandra';
import ActionByCauseIdRepository from '../infra/action-by-cause-id.repository.cassandra';
import * as Domain from '../domain';

@Injectable()
export class CommunityReportsServiceImpl implements CommunityReportsService {
  constructor(
    private readonly communityByCommunityIdRepository: CommunityByCommunityIdRepository,
    private readonly causeByCommunityIdRepository: CauseByCommunityIdRepository,
    private readonly actionByCauseIdRepository: ActionByCauseIdRepository,
  ) {}

  async findOne(id: string): Promise<Domain.CommunityByCommunityId> {
    // Fetch community and causes
    const [community, causes] = await Promise.all([
      this.communityByCommunityIdRepository.findOneByCommunityId(id),
      this.causeByCommunityIdRepository.findManyByCommunityId(id),
    ]);

    // Add causes to community
    community.addCauses(causes);

    // Fetch actions for each cause
    await Promise.all(
      causes.map(async (cause) => {
        const actions = await this.actionByCauseIdRepository.findManyByCauseId(
          cause.causeId,
        );
        cause.addActions(actions);
        return cause;
      }),
    );

    // Return community domain object
    return community;
  }
}
