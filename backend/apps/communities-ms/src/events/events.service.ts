import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@common-lib/common-lib/kafka/event-publisher.interface';
import { ActionCreatedEvent } from '@communities-ms/actions/domain/events/ActionCreatedEvent';
import { ActionContributedEvent } from '@communities-ms/actions/domain/events/ActionContributedEvent';
import { CommunityCreatedEvent } from '@communities-ms/communities/domain/events';
import { JoinCommunityRequestCreatedEvent } from '@communities-ms/communities/domain/events/JoinCommunityRequestCreatedEvent';

@Injectable()
export class CommunitiesEventService {
  constructor(private readonly eventPublisher: EventPublisher) {}

  async emitActionCreatedEvent(event: ActionCreatedEvent): Promise<void> {
    await this.eventPublisher.emitEvent('action-created', event);
  }

  async emitActionContributedEvent(
    event: ActionContributedEvent,
  ): Promise<void> {
    await this.eventPublisher.emitEvent('action-contributed', event);
  }

  async createCommunity(event: CommunityCreatedEvent): Promise<void> {
    await this.eventPublisher.emitEvent('community-created', event);
  }

  async createJoinCommunityRequest(
    event: JoinCommunityRequestCreatedEvent,
  ): Promise<void> {
    await this.eventPublisher.emitEvent(
      'join-community-request-created',
      event,
    );
  }
}
