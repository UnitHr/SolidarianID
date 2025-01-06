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
}
