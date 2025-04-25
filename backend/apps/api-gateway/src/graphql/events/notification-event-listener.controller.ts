import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationCreatedEvent } from '@common-lib/common-lib/events/domain/NotificationCreatedEvent';
import { NotificationModel } from '../models/notification.model';
import { NotificationService } from '../services/notification.service';

@Controller()
export class NotificationEventListenerController {
  private readonly logger = new Logger(
    NotificationEventListenerController.name,
  );

  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern(NotificationCreatedEvent.EVENT_TYPE)
  async handleNotificationCreated(
    @Payload() message: NotificationCreatedEvent,
  ) {
    try {
      this.logger.log(
        `Received notification event: ${JSON.stringify(message)}`,
      );

      const notification: NotificationModel = {
        id: message.notificationId,
        read: message.read,
        timestamp: message.timestamp,
        recipientId: message.recipientId,
        type: message.type,
        entityId: message.entityId,
        entityName: message.entityName,
      };

      await this.notificationService.publishNewNotification(notification);
      this.logger.debug(
        `Notification details: ${JSON.stringify(notification)}`,
      );
    } catch (error) {
      this.logger.error(
        `Error handling notification event: ${error.message}`,
        error.stack,
      );
    }
  }
}
