import { NotificationService } from '@api-gateway/graphql/application/notification.service';
import { PubSubService } from '@api-gateway/graphql/application/pubsub.service';
import { NotificationModel } from '@api-gateway/graphql/models/notification.model';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationServiceImpl implements NotificationService {
  private readonly logger = new Logger(NotificationServiceImpl.name);

  constructor(private readonly pubSub: PubSubService) {}

  async publishNewNotification(notification: NotificationModel): Promise<void> {
    await this.pubSub.publish('notificationAdded', notification);
  }
}
