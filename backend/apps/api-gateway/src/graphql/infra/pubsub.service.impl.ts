import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class PubSubServiceImpl {
  private pubSub: PubSub;

  constructor() {
    this.pubSub = new PubSub();
  }

  async publish(trigger: string, payload: unknown): Promise<void> {
    return this.pubSub.publish(trigger, payload);
  }

  asyncIterator<T>(triggers: string | string[]): AsyncIterator<T> {
    return this.pubSub.asyncIterableIterator<T>(triggers);
  }
}
