import { Repository } from '@common-lib/common-lib/core/repository';
import { HistoryEntry } from './HistoryEntry';
import { HistoryEntryType } from './HistoryEntryType';
import { EntryStatus } from './HistoryEntryStatus';

export abstract class HistoryEntryRepository extends Repository<HistoryEntry> {
  abstract findByUserId(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<HistoryEntry[]>;

  abstract findByUserIdAndType(
    userId: string,
    type: HistoryEntryType,
    page?: number,
    limit?: number,
  ): Promise<HistoryEntry[]>;

  abstract countByUserId(userId: string): Promise<number>;

  abstract countByUserIdAndType(
    userId: string,
    type: HistoryEntryType,
  ): Promise<number>;

  abstract findByEntityIdTypeAndStatus(
    userId: string,
    entityId: string,
    type: HistoryEntryType,
    status: EntryStatus,
  ): Promise<HistoryEntry | null>;
}
