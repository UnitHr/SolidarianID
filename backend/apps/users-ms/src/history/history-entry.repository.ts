import { Repository } from '@common-lib/common-lib/core/repository';
import { HistoryEntry } from './domain/HistoryEntry';
import { ActivityType } from './domain/ActivityType';
import { EntryStatus } from './domain/HistoryEntryStatus';

export abstract class HistoryEntryRepository extends Repository<HistoryEntry> {
  abstract findByUserIdEntityIdTypeAndStatus(
    userId: string,
    entityId: string,
    type: ActivityType,
    status: EntryStatus,
  ): Promise<HistoryEntry>;

  abstract findByUserIdWithFilters(
    userId: string,
    type?: ActivityType,
    status?: EntryStatus,
    page?: number,
    limit?: number,
  ): Promise<HistoryEntry[]>;

  abstract countByUserIdWithFilters(
    userId: string,
    type?: ActivityType,
    status?: EntryStatus,
  ): Promise<number>;

  abstract existsUserJoinCommunityRequestWithAdmin(
    userId: string,
    JOIN_COMMUNITY_REQUEST_SENT: ActivityType,
    adminId: string,
  ): Promise<boolean>;
}
