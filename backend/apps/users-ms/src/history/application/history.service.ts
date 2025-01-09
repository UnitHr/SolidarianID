import { History } from '../domain/History';

export abstract class HistoryService {
  abstract createHistory(userId: string): Promise<string>;

  abstract getHistoryByUserId(userId: string): Promise<History>;

  abstract registerUserFollowed(
    userId: string,
    followedUserId: string,
  ): Promise<void>;

  abstract registerCommunityCreation(
    adminId: string,
    communityId: string,
  ): Promise<void>;

  abstract registerActionContribute(
    userId: string,
    actionId: string,
  ): Promise<void>;

  abstract registerJoinCommunityRequest(
    userId: string,
    communityId: string,
  ): Promise<void>;

  abstract registerJoinCommunityRequestRejected(
    userId: string,
    communityId: string,
  ): Promise<void>;

  abstract registerUserJoinedCommunity(
    userId: string,
    communityId: string,
  ): Promise<void>;

  abstract registerCauseCreation(
    userId: string,
    causeId: string,
  ): Promise<void>;

  abstract registerCauseSupported(
    userId: string,
    causeId: string,
  ): Promise<void>;
}
