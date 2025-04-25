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
    this.notificationService.createNotificationsForFollowers(
      event.historyEntryId,
      event.userId,
      event.date,
    );
    this.logger.log(
      `Created notifications for followers of user ${event.userId} for history activity <${event.type}> with id ${event.historyEntryId}`,
    );
  }
}
