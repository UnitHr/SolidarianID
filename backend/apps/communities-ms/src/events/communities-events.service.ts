import { Injectable } from '@nestjs/common';
import { ActionCreatedEvent } from '@communities-ms/actions/domain/events/ActionCreatedEvent';
import { ActionContributedEvent } from '@communities-ms/actions/domain/events/ActionContributedEvent';
import {
  CommunityCreatedEvent,
  UserJoinedCommunity,
} from '@communities-ms/communities/domain/events';
import { JoinCommunityRequestCreatedEvent } from '@communities-ms/communities/domain/events/JoinCommunityRequestCreatedEvent';
import { CauseCreatedEvent } from '@communities-ms/causes/domain/events/CauseCreatedEvent';
import { CauseSupportedEvent } from '@communities-ms/causes/domain/events/CauseSupportedEvent';
import { JoinCommunityRequestRejectedEvent } from '@communities-ms/communities/domain/events/JoinCommunityRequestRejected';
import { EventsService } from '@common-lib/common-lib/events/events.service';

@Injectable()
export class CommunitiesEventService {
  constructor(private readonly eventsService: EventsService) {}

  async emitActionCreatedEvent(event: ActionCreatedEvent): Promise<void> {
    await this.eventsService.publish('action-created', event);
  }

  async emitActionContributedEvent(
    event: ActionContributedEvent,
  ): Promise<void> {
    await this.eventsService.publish('action-contributed', event);
  }

  async emitCommunityCreatedEvent(event: CommunityCreatedEvent): Promise<void> {
    await this.eventsService.publish('community-created', event);
  }

  async emitJoinCommunityRequestEvent(
    event: JoinCommunityRequestCreatedEvent,
  ): Promise<void> {
    await this.eventsService.publish('join-community-request-created', event);
  }

  async emitUserJoinedCommunityEvent(
    event: UserJoinedCommunity,
  ): Promise<void> {
    await this.eventsService.publish('user-joined-community', event);
  }

  async emitCauseCreatedEvent(event: CauseCreatedEvent): Promise<void> {
    await this.eventsService.publish('cause-created', event);
  }

  async emitCauseSupportedEvent(event: CauseSupportedEvent): Promise<void> {
    await this.eventsService.publish('cause-supported', event);
  }

  async emitJoinCommunityRequestRejectedEvent(
    event: JoinCommunityRequestRejectedEvent,
  ): Promise<void> {
    await this.eventsService.publish('join-community-request-rejected', event);
  }
}
