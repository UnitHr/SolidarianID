import { Injectable, Logger } from '@nestjs/common';
import { NotificationModel } from '../models/notification.model';
import { PubSubService } from './pubsub.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly pubSub: PubSubService) {}

  async publishNewNotification(notification: NotificationModel): Promise<void> {
    await this.pubSub.publish('notificationAdded', notification);
  }
}
