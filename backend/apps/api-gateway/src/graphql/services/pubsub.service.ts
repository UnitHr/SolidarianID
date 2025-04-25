import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { NotificationModel } from '../models/notification.model';

@Injectable()
export class PubSubService {
  private pubSub: PubSub;

  constructor() {
    this.pubSub = new PubSub();
  }

  async publish(trigger: string, payload: NotificationModel): Promise<void> {
    return this.pubSub.publish(trigger, payload);
  }

  asyncIterator<T>(triggers: string | string[]): AsyncIterator<T> {
    return this.pubSub.asyncIterableIterator<T>(triggers);
  }
}
