import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@common-lib/common-lib/kafka/event-publisher.interface';
import { ActionCreatedEvent } from './actions/domain/events/ActionCreatedEvent';

@Injectable()
export class CommunitiesEventService {
  constructor(private readonly eventPublisher: EventPublisher) {}

  async emitActionCreatedEvent(event: ActionCreatedEvent): Promise<void> {
    await this.eventPublisher.emitEvent('action-created', event);
  }
}
