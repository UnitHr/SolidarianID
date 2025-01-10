import { HistoryEntry } from '../domain/HistoryEntry';
import { HistoryEntryType } from '../domain/HistoryEntryType';

export interface GetHistoryOptions {
  page?: number;
  limit?: number;
  type?: HistoryEntryType;
}

export abstract class HistoryService {
  abstract getUserHistory(
    userId: string,
    options?: GetHistoryOptions,
  ): Promise<{
    entries: HistoryEntry[];
    total: number;
  }>;

  abstract registerUserFollowed(
    userId: string,
    followedUserId: string,
    followedUserName?: string,
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
