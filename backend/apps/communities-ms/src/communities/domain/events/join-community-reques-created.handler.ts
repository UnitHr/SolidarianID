import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { CommunitiesEventService } from '@communities-ms/events/communities-events.service';
import { JoinCommunityRequestCreatedEvent } from './JoinCommunityRequestCreatedEvent';

@EventsHandler(JoinCommunityRequestCreatedEvent)
export class JoinCommunityRequestCreatedHandler
  implements IEventHandler<JoinCommunityRequestCreatedEvent>
{
  private readonly logger = new Logger(JoinCommunityRequestCreatedHandler.name);

  constructor(private readonly eventsService: CommunitiesEventService) {}

  async handle(event: JoinCommunityRequestCreatedEvent) {
    await this.eventsService.emitJoinCommunityRequestEvent(event);
    this.logger.log(
      `Internal join community request created event handled: User ${event.userId} requested to join community ${event.communityId}`,
    );
  }
}
