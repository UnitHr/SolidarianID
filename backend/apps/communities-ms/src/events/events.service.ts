import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@common-lib/common-lib/kafka/event-publisher.interface';
import { ActionCreatedEvent } from '@communities-ms/actions/domain/events/ActionCreatedEvent';
import { ActionContributedEvent } from '@communities-ms/actions/domain/events/ActionContributedEvent';
import {
  CommunityCreatedEvent,
  UserJoinedCommunity,
} from '@communities-ms/communities/domain/events';
import { JoinCommunityRequestCreatedEvent } from '@communities-ms/communities/domain/events/JoinCommunityRequestCreatedEvent';
import { CauseCreatedEvent } from '@communities-ms/causes/domain/events/CauseCreatedEvent';
import { CauseSupportedEvent } from '@communities-ms/causes/domain/events/CauseSupportedEvent';

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

  async emitCommunityCreatedEvent(event: CommunityCreatedEvent): Promise<void> {
    await this.eventPublisher.emitEvent('community-created', event);
  }

  async emitJoinCommunityRequestEvent(
    event: JoinCommunityRequestCreatedEvent,
  ): Promise<void> {
    await this.eventPublisher.emitEvent(
      'join-community-request-created',
      event,
    );
  }

  async emitUserJoinedCommunityEvent(
    event: UserJoinedCommunity,
  ): Promise<void> {
    await this.eventPublisher.emitEvent('user-joined-community', event);
  }

  async emitCauseCreatedEvent(event: CauseCreatedEvent): Promise<void> {
    await this.eventPublisher.emitEvent('cause-created', event);
  }

  async emitCauseSupportedEvent(event: CauseSupportedEvent): Promise<void> {
    await this.eventPublisher.emitEvent('cause-supported', event);
  }
}
