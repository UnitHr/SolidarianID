import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import * as Domain from './domain';
import * as Persistence from './infra/persistence';
import { HistoryEntryDto } from './dto/HistoryEntryDto';

export class HistoryEntryMapper {
  static toDomain(raw: Persistence.HistoryEntry): Domain.HistoryEntry {
    const historyEntry = Domain.HistoryEntry.create(
      {
        userId: new UniqueEntityID(raw.userId),
        entityId: new UniqueEntityID(raw.entityId),
        type: raw.type,
        timestamp: raw.timestamp,
        status: raw.status,
        metadata: raw.metadata ?? {},
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
      timestamp: historyEntry.timestamp,
      status: historyEntry.status,
      metadata: historyEntry.metadata,
    };
  }

  static toDto(entry: Domain.HistoryEntry): HistoryEntryDto {
    const dto: HistoryEntryDto = {
      type: entry.type,
      entityId: entry.entityId.toString(),
      timestamp: entry.timestamp,
    };

    if (entry.status) {
      dto.status = entry.status;
    }

    if (entry.metadata && Object.keys(entry.metadata).length > 0) {
      dto.metadata = entry.metadata;
    }

    return dto;
  }
}
