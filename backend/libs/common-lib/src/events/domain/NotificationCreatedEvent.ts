import { DomainEvent } from '@common-lib/common-lib/core/domain/DomainEvent';
import { ActivityType } from '@users-ms/history/domain';

export class NotificationCreatedEvent extends DomainEvent {
  public static readonly EVENT_TYPE = 'notification-created';

  constructor(
    public readonly notificationId: string,
    public readonly read: boolean,
    public readonly timestamp: Date,
    public readonly recipientId: string,
    public readonly userId: string,
    public readonly type: ActivityType,
    public readonly entityId: string,
    public readonly entityName: string,
  ) {
    super(NotificationCreatedEvent.name);
  }
}
