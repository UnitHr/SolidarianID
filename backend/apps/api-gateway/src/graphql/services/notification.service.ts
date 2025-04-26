import { Injectable, Logger } from '@nestjs/common';
import { NotificationModel } from '../models/notification.model';
import { PubSubService } from './pubsub.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly pubSub: PubSubService) {}

  async publishNewNotification(notification: NotificationModel): Promise<void> {
    this.logger.debug(
      `Publishing notification event: ${JSON.stringify(notification)}`,
    );

    await this.pubSub.publish('notificationAdded', notification);
  }
}
