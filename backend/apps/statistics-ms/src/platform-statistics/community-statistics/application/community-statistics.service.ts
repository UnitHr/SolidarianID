import { CommunityStatistics } from '../domain';

export abstract class CommunityStatisticsService {
  abstract getAll(): Promise<CommunityStatistics[]>;

  abstract getTotalSupports(): Promise<number>;

  abstract registerComunityCreation(
    communityId: string,
    communityName: string,
  ): Promise<void>;

  abstract registerCauseSupport(communityId: string): Promise<void>;

  abstract registerCausesTargeted(
    communityId: string,
    amount: number,
  ): Promise<void>;

  abstract registerCausesAchieved(
    communityId: string,
    amount: number,
  ): Promise<void>;
}
