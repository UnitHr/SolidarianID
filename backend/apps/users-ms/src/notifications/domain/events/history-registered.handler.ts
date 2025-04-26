import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ActivityType } from '@users-ms/history/domain';
import { HistoryRegisteredEvent } from '@users-ms/history/domain/events/HistoryRegisteredEvent';
import { NotificationService } from '@users-ms/notifications/application/notification.service';

@EventsHandler(HistoryRegisteredEvent)
export class HistoryRegisteredHandler
  implements IEventHandler<HistoryRegisteredEvent>
{
  constructor(private readonly notificationService: NotificationService) {}

  private readonly logger = new Logger(HistoryRegisteredHandler.name);

  async handle(event: HistoryRegisteredEvent) {
    if (event.type === ActivityType.COMMUNITY_CREATION_REQUEST_SENT) {
      await this.notificationService.createNotificationsForPlatformAdmins(
        event.historyEntryId,
        event.date,
      );
      return;
    }
    if (event.type === ActivityType.JOIN_COMMUNITY_REQUEST_SENT) {
      await this.notificationService.createNotificationForRelatedEntity(
        event.historyEntryId,
        event.relatedEntityId,
        event.date,
      );
      return;
    }
    await this.notificationService.createNotificationsForFollowers(
      event.historyEntryId,
      event.userId,
      event.date,
    );
  }
}
