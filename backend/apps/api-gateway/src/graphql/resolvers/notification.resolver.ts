import { Logger } from '@nestjs/common';
import { Args, ID, Resolver, Subscription } from '@nestjs/graphql';
import { NotificationModel } from '../models/notification.model';
import { PubSubService } from '../application/pubsub.service';

@Resolver(() => NotificationModel)
export class NotificationResolver {
  private readonly logger = new Logger(NotificationResolver.name);

  constructor(private readonly pubSub: PubSubService) {}

  @Subscription(() => NotificationModel, {
    filter: (payload, variables) => payload.recipientId === variables.userId,
    resolve: (value: NotificationModel) => value,
  })
  notificationAdded(@Args('userId', { type: () => ID }) userId: string) {
    this.logger.debug(`User ${userId} subscribed to notifications`);
    return this.pubSub.asyncIterator('notificationAdded');
  }
}
