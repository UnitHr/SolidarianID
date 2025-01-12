import { Injectable } from '@nestjs/common';
import CommunityStatisticsRepository from '../infra/community-statistics.repository.cassandra';
import { CommunityStatisticsService } from './community-statistics.service';
import { CommunityStatistics } from '../domain';

@Injectable()
export class CommunityStatisticsServiceImpl
  implements CommunityStatisticsService
{
  constructor(
    private readonly communityStatisticsRepository: CommunityStatisticsRepository,
  ) {}

  getAll(): Promise<CommunityStatistics[]> {
    return this.communityStatisticsRepository.findAllEntities();
  }

  getTotalSupports(): Promise<number> {
    return this.communityStatisticsRepository.getTotalSupports();
  }

  registerCommunityCreation(
    communityId: string,
    communityName: string,
  ): Promise<void> {
    // Create a new community statistics
    const communityStatistics = CommunityStatistics.create(
      communityId,
      communityName,
    );

    // Save
    return this.communityStatisticsRepository.save(communityStatistics);
  }

  async registerCauseSupport(communityId: string): Promise<void> {
    // Fetch the community statistics
    const communityStatistics =
      await this.communityStatisticsRepository.findOneEntity(communityId);

    // Increment the support count
    communityStatistics.incrementSupportCount();

    // Save
    return this.communityStatisticsRepository.save(communityStatistics);
  }

  async registerCausesTargeted(
    communityId: string,
    amount: number,
  ): Promise<void> {
    // Fetch the community statistics
    const communityStatistics =
      await this.communityStatisticsRepository.findOneEntity(communityId);

    // Increment the counter
    communityStatistics.incrementActionsTargetTotal(amount);

    // Save
    return this.communityStatisticsRepository.save(communityStatistics);
  }

  async registerCausesAchieved(
    communityId: string,
    amount: number,
  ): Promise<void> {
    // Fetch the community statistics
    const communityStatistics =
      await this.communityStatisticsRepository.findOneEntity(communityId);

    // Increment the counter
    communityStatistics.incrementActionsAchievedTotal(amount);

    // Save
    return this.communityStatisticsRepository.save(communityStatistics);
  }
}
