import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { HistoryRegisteredEvent } from '@users-ms/history/domain/events/HistoryRegisteredEvent';
import { NotificationService } from '@users-ms/notifications/application/notification.service';

@EventsHandler(HistoryRegisteredEvent)
export class HistoryRegisteredHandler
  implements IEventHandler<HistoryRegisteredEvent>
{
  constructor(private readonly notificationService: NotificationService) {}

  private readonly logger = new Logger(HistoryRegisteredHandler.name);

  handle(event: HistoryRegisteredEvent) {
    this.logger.log(`Internal event captured: ${event.constructor.name}`);
    this.notificationService.createNotificationsForFollowers(
      event.historyEntryId,
      event.userId,
      event.activityType,
      event.entityId,
      event.date,
    );
    this.logger.log(
      `Created notifications for followers of user ${event.userId} for activity type ${event.activityType}`,
    );
  }
}
