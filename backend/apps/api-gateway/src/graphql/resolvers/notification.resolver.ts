import { Logger } from '@nestjs/common';
import { Args, ID, Resolver, Subscription } from '@nestjs/graphql';
import { PubSubService } from '../services/pubsub.service';
import { NotificationModel } from '../models/notification.model';

@Resolver(() => NotificationModel)
export class NotificationResolver {
  private readonly logger = new Logger(NotificationResolver.name);

  constructor(private readonly pubSub: PubSubService) {}

  @Subscription(() => NotificationModel, {
    filter: (payload, variables) => {
      return payload.notificationAdded.recipientId === variables.userId;
    },
  })
  notificationAdded(@Args('userId', { type: () => ID }) userId: string) {
    this.logger.log(`User ${userId} subscribed to notifications`);
    return this.pubSub.asyncIterator('notificationAdded');
  }
}
