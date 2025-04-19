import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import * as Domain from './domain';
import * as Persistence from './infra/persistence';
import { NotificationDto } from './dto/notification.dto';

export class NotificationMapper {
  public static toDomain(raw: Persistence.Notification): Domain.Notification {
    const props = {
      userId: new UniqueEntityID(raw.userId),
      historyEntryId: new UniqueEntityID(raw.historyEntryId),
      primaryEntityId: new UniqueEntityID(raw.primaryEntityId),
      activityType: raw.activityType,
      secondaryEntityId: raw.secondaryEntityId
        ? new UniqueEntityID(raw.secondaryEntityId)
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
      userId: notification.userId.toString(),
      historyEntryId: notification.historyEntryId.toString(),
      primaryEntityId: notification.primaryEntityId.toString(),
      activityType: notification.activityType,
      secondaryEntityId: notification.secondaryEntityId?.toString(),
      read: notification.read,
      timestamp: notification.timestamp,
      updatedAt: new Date(),
    };
  }

  public static toDto(notification: Domain.Notification): NotificationDto {
    return {
      id: notification.id.toString(),
      userId: notification.userId.toString(),
      primaryEntityId: notification.primaryEntityId.toString(),
      activityType: notification.activityType,
      secondaryEntityId: notification.secondaryEntityId?.toString(),
      read: notification.read,
      timestamp: notification.timestamp,
      historyEntryId: notification.historyEntryId.toString(),
    };
  }
}
