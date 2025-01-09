import { Injectable } from '@nestjs/common';
import { ODSEnum } from '@common-lib/common-lib/common/ods';
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

  async findCommunityReport(
    communityId: string,
  ): Promise<Domain.CommunityByCommunityId> {
    // Fetch community and causes
    const [community, causes] = await Promise.all([
      this.communityByCommunityIdRepository.findOneByCommunityId(communityId),
      this.causeByCommunityIdRepository.findManyByCommunityId(communityId),
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

  registerCommunityCreation(
    communityId: string,
    communityName: string,
    adminId: string,
  ): Promise<void> {
    // Create community
    const community = Domain.CommunityByCommunityId.create(
      communityId,
      communityName,
      adminId,
    );

    // Save
    return this.communityByCommunityIdRepository.save(community);
  }

  async registerCommunityJoinMember(communityId: string): Promise<void> {
    // Fetch community
    const community =
      await this.communityByCommunityIdRepository.findOneByCommunityId(
        communityId,
      );

    // Increment members count
    community.incrementMembersCount();

    // Save
    return this.communityByCommunityIdRepository.save(community);
  }

  async registerCauseCreation(
    communityId: string,
    causeId: string,
    causeName: string,
    ods: ODSEnum,
  ): Promise<void> {
    // Fetch community
    const community =
      await this.communityByCommunityIdRepository.findOneByCommunityId(
        communityId,
      );

    // Add ODS to community
    community.addOds(ods);

    // Save community
    await this.communityByCommunityIdRepository.save(community);

    // Create cause
    const cause = Domain.CauseByCommunityId.create(
      communityId,
      causeId,
      causeName,
      ods,
    );

    // Save cause
    return this.causeByCommunityIdRepository.save(cause);
  }

  async registerCauseAddSupporter(causeId: string): Promise<void> {
    // Fetch cause
    const cause =
      await this.causeByCommunityIdRepository.findOneByCauseId(causeId);

    // Increment supporters count
    cause.incrementSupportsCount();

    // Save
    return this.causeByCommunityIdRepository.save(cause);
  }

  registerActionCreation(
    causeId: string,
    actionId: string,
    actionName: string,
    target: number,
  ): Promise<void> {
    // Create action
    const action = Domain.ActionByCauseId.create(
      causeId,
      actionId,
      actionName,
      target,
    );

    // Save
    return this.actionByCauseIdRepository.save(action);
  }

  async registerActionContributed(
    actionId: string,
    amount: number,
  ): Promise<void> {
    // Fetch action
    const action =
      await this.actionByCauseIdRepository.findOneByActionId(actionId);

    // Increment contributions count
    action.incrementAchieved(amount);

    // Save
    return this.actionByCauseIdRepository.save(action);
  }
}
