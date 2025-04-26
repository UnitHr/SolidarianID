import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationCreatedEvent } from '@common-lib/common-lib/events/domain/NotificationCreatedEvent';
import { NotificationService } from '@api-gateway/graphql/services/notification.service';
import { NotificationModel } from '../notification.model';

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
