import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import * as Domain from './domain';
import * as Persistence from './infra/persistence';
import { NotificationDto } from './dto/notification.dto';

export class NotificationMapper {
  public static toDomain(raw: Persistence.Notification): Domain.Notification {
    return Domain.Notification.create(
      {
        userId: new UniqueEntityID(raw.userId),
        historyEntryId: new UniqueEntityID(raw.historyEntryId),
        activityType: raw.activityType,
        entityId: new UniqueEntityID(raw.entityId),
        read: raw.read,
        timestamp: raw.timestamp,
      },
      new UniqueEntityID(raw.id),
    );
  }

  public static toPersistence(
    notification: Domain.Notification,
  ): Persistence.Notification {
    return {
      id: notification.id.toString(),
      userId: notification.userId.toString(),
      historyEntryId: notification.historyEntryId.toString(),
      activityType: notification.activityType,
      entityId: notification.entityId.toString(),
      read: notification.read,
      timestamp: notification.timestamp,
      updatedAt: new Date(),
    };
  }

  public static toDto(notification: Domain.Notification): NotificationDto {
    return {
      id: notification.id.toString(),
      userId: notification.userId.toString(),
      activityType: notification.activityType,
      entityId: notification.entityId.toString(),
      read: notification.read,
      timestamp: notification.timestamp,
      historyEntryId: notification.historyEntryId.toString(),
    };
  }
}
