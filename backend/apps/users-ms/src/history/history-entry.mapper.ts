import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import * as Domain from './domain';
import * as Persistence from './infra/persistence';
import { HistoryEntryDto } from './dto/history-entry.dto';

export class HistoryEntryMapper {
  static toDomain(raw: Persistence.HistoryEntry): Domain.HistoryEntry {
    const historyEntry = Domain.HistoryEntry.create(
      {
        userId: new UniqueEntityID(raw.userId),
        entityId: new UniqueEntityID(raw.entityId),
        type: raw.type,
        entityName: raw.entityName,
        adminId: raw.adminId,
        timestamp: raw.timestamp,
        status: raw.status,
      },
      new UniqueEntityID(raw.id),
    );
    return historyEntry;
  }

  static toPersistence(
    historyEntry: Domain.HistoryEntry,
  ): Persistence.HistoryEntry {
    return {
      id: historyEntry.id.toString(),
      userId: historyEntry.userId.toString(),
      entityId: historyEntry.entityId.toString(),
      type: historyEntry.type,
      entityName: historyEntry.entityName,
      adminId: historyEntry.adminId,
      timestamp: historyEntry.timestamp,
      status: historyEntry.status,
    };
  }

  static toDto(entry: Domain.HistoryEntry): HistoryEntryDto {
    return {
      type: entry.type,
      entityId: entry.entityId.toString(),
      timestamp: entry.timestamp,
      entityName: entry.entityName ?? undefined,
      status: entry.status ?? undefined,
    };
  }
}
