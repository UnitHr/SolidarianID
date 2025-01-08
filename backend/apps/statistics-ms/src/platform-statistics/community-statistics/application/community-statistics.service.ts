import { CommunityStatistics } from '../domain';

export abstract class CommunityStatisticsService {
  abstract getAll(): Promise<CommunityStatistics[]>;

  abstract getTotalSupports(): Promise<number>;
}
