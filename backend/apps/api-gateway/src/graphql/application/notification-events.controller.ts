import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationCreatedEvent } from '@common-lib/common-lib/events/domain/NotificationCreatedEvent';
import { NotificationModel } from '../models/notification.model';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationEventsController {
  private readonly logger = new Logger(NotificationEventsController.name);

  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern(NotificationCreatedEvent.EVENT_TYPE)
  async handleNotificationCreated(
    @Payload() message: NotificationCreatedEvent,
  ) {
    try {
      const notification: NotificationModel = {
        id: message.notificationId,
        ...message,
      };

      await this.notificationService.publishNewNotification(notification);
    } catch (error) {
      this.logger.error(
        `Error handling notification event: ${error.message}`,
        error.stack,
      );
    }
  }
}
