import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { HistoryEntryMapper } from '@users-ms/history/history-entry.mapper';
import * as Domain from './domain';
import * as Persistence from './infra/persistence';
import { NotificationDto } from './dto/notification.dto';

export class NotificationMapper {
  public static toDomain(raw: Persistence.Notification): Domain.Notification {
    const props = {
      recipientId: new UniqueEntityID(raw.recipientId),
      historyEntryId: new UniqueEntityID(raw.historyEntryId),
      historyEntry: raw.historyEntry
        ? HistoryEntryMapper.toDomain(raw.historyEntry)
        : undefined,
      read: raw.read,
      timestamp: raw.timestamp,
    };

    return Domain.Notification.create(props, new UniqueEntityID(raw.id));
  }

  public static toPersistence(
    notification: Domain.Notification,
  ): Persistence.Notification {
    return {
      id: notification.id.toString(),
      recipientId: notification.recipientId.toString(),
      historyEntryId: notification.historyEntryId?.toString(),
      historyEntry: notification.historyEntry
        ? HistoryEntryMapper.toPersistence(notification.historyEntry)
        : undefined,
      read: notification.read,
      timestamp: notification.timestamp,
      updatedAt: new Date(),
    };
  }

  public static toDto(notification: Domain.Notification): NotificationDto {
    const { historyEntry } = notification;

    return {
      id: notification.id.toString(),
      read: notification.read,
      timestamp: notification.timestamp,
      userId: historyEntry?.userId.toString(),
      type: historyEntry?.type,
      entityId: historyEntry?.entityId.toString(),
      entityName: historyEntry?.entityName,
    };
  }
}
