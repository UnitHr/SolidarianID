import { Repository } from '@common-lib/common-lib/core/repository';
import { HistoryEntry } from './HistoryEntry';
import { HistoryEntryType } from './HistoryEntryType';
import { EntryStatus } from './HistoryEntryStatus';

export abstract class HistoryEntryRepository extends Repository<HistoryEntry> {
  abstract findByUserIdEntityIdTypeAndStatus(
    userId: string,
    entityId: string,
    type: HistoryEntryType,
    status: EntryStatus,
  ): Promise<HistoryEntry>;

  abstract findByUserIdWithFilters(
    userId: string,
    type?: HistoryEntryType,
    status?: EntryStatus,
    page?: number,
    limit?: number,
  ): Promise<HistoryEntry[]>;

  abstract countByUserIdWithFilters(
    userId: string,
    type?: HistoryEntryType,
    status?: EntryStatus,
  ): Promise<number>;

  abstract existsUserJoinCommunityRequestWithAdmin(
    userId: string,
    JOIN_COMMUNITY_REQUEST_SENT: HistoryEntryType,
    adminId: string,
  ): Promise<boolean>;
}
