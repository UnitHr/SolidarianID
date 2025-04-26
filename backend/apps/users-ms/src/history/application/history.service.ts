import { HistoryEntry } from '../domain/HistoryEntry';
import { ActivityType } from '../domain/ActivityType';
import { EntryStatus } from '../domain/HistoryEntryStatus';

export abstract class HistoryService {
  abstract getUserHistory(
    userId: string,
    type?: ActivityType,
    status?: EntryStatus,
    page?: number,
    limit?: number,
  ): Promise<{ entries: HistoryEntry[]; total: number }>;

  abstract registerUserFollowed(
    userId: string,
    followedUserId: string,
    timestamp: Date,
    followedUserFullName?: string,
  ): Promise<void>;

  abstract registerCommunityCreation(
    adminId: string,
    communityId: string,
    communityName: string,
    timestamp: Date,
  ): Promise<void>;

  abstract registerCommunityCreationRequest(
    userId: string,
    requestId: string,
    communityName: string,
    timestamp: Date,
  ): Promise<void>;

  abstract registerActionCreation(
    userId: string,
    causeId: string,
    causeName: string,
    timestamp: Date,
  ): Promise<void>;

  abstract registerActionContribute(
    userId: string,
    actionId: string,
    actionName: string,
    timestamp: Date,
  ): Promise<void>;

  abstract registerJoinCommunityRequest(
    userId: string,
    communityId: string,
    communityName: string,
    adminId: string,
    timestamp: Date,
  ): Promise<void>;

  abstract registerJoinCommunityRequestRejected(
    userId: string,
    communityId: string,
    communityName: string,
    timestamp: Date,
  ): Promise<void>;

  abstract registerUserJoinedCommunity(
    userId: string,
    communityId: string,
    communityName: string,
    timestamp: Date,
  ): Promise<void>;

  abstract registerCauseCreation(
    userId: string,
    causeId: string,
    causeName: string,
    timestamp: Date,
  ): Promise<void>;

  abstract registerCauseSupported(
    userId: string,
    causeId: string,
    causeName: string,
    timestamp: Date,
  ): Promise<void>;

  abstract userHasJoinCommunityRequestWithAdmin(
    userId: string,
    adminId: string,
  ): Promise<boolean>;
}
