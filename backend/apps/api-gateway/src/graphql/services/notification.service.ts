import { Injectable, Logger } from '@nestjs/common';
import { NotificationModel } from '../models/notification.model';
import { PubSubService } from './pubsub.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly pubSub: PubSubService) {}

  async publishNewNotification(notification: NotificationModel): Promise<void> {
    this.logger.log(
      `Publishing notification for user ${notification.recipientId}`,
    );

    await this.pubSub.publish('notificationAdded', notification);
  }
}
