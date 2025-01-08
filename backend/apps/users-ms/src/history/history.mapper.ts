import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import * as Domain from './domain';
import * as Persistence from './infra/persistence';
import { HistoryEntryMapper } from './history-entry.mapper';
import { HistoryDto } from './dto/HistoryDto';

export class HistoryMapper {
  static toDomain(raw: Persistence.History): Domain.History {
    const history = Domain.History.create(
      {
        userId: new UniqueEntityID(raw.userId),
        entries:
          raw.entries?.map((entry) => HistoryEntryMapper.toDomain(entry)) || [],
      },
      new UniqueEntityID(raw.id),
    );
    return history;
  }

  static toPersistence(history: Domain.History): Persistence.History {
    const historyEntity = {
      id: history.id.toString(),
      userId: history.userId.toString(),
      entries: [],
    };
    historyEntity.entries = history.entries.map((entry) =>
      HistoryEntryMapper.toPersistence(entry, historyEntity),
    );
    return historyEntity;
  }

  static toDto(history: Domain.History): HistoryDto {
    return {
      userId: history.userId.toString(),
      entries: history.entries.map((entry) => HistoryEntryMapper.toDto(entry)),
    };
  }
}
