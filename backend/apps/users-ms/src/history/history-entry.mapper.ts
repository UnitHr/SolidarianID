import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import * as Domain from './domain';
import * as Persistence from './infra/persistence';
import { HistoryEntryDto } from './dto/HistoryEntryDto';

export class HistoryEntryMapper {
  static toDomain(raw: Persistence.HistoryEntry): Domain.HistoryEntry {
    const historyEntry = Domain.HistoryEntry.create(
      {
        ...raw,
        entityId: new UniqueEntityID(raw.entityId),
      },
      new UniqueEntityID(raw.id),
    );
    return historyEntry;
  }

  static toPersistence(
    historyEntry: Domain.HistoryEntry,
    history: Persistence.History,
  ): Persistence.HistoryEntry {
    return {
      id: historyEntry.id.toString(),
      entityId: historyEntry.entityId.toString(),
      type: historyEntry.type,
      timestamp: historyEntry.timestamp,
      status: historyEntry.status,
      history,
    };
  }

  static toDto(entry: Domain.HistoryEntry): HistoryEntryDto {
    return {
      entityId: entry.entityId.toString(),
      type: entry.type,
      timestamp: entry.timestamp,
      status: entry.status,
    };
  }
}
