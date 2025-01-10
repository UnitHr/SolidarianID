import { HistoryEntry } from '../domain/HistoryEntry';
import { HistoryEntryType } from '../domain/HistoryEntryType';
import { EntryStatus } from '../domain/HistoryEntryStatus';

export abstract class HistoryService {
  abstract getUserHistory(
    userId: string,
    type?: HistoryEntryType,
    status?: EntryStatus,
    page?: number,
    limit?: number,
  ): Promise<{ entries: HistoryEntry[]; total: number }>;

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
    adminId: string,
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

  abstract userHasJoinCommunityRequestWithAdmin(
    historyOwner: string,
    userId: string,
  ): Promise<boolean>;
}
