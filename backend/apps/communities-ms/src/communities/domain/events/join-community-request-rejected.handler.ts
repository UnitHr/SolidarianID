import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { CommunitiesEventService } from '@communities-ms/events/communities-events.service';
import { JoinCommunityRequestRejectedEvent } from './JoinCommunityRequestRejected';

@EventsHandler(JoinCommunityRequestRejectedEvent)
export class JoinCommunityRequestRejectedHandler
  implements IEventHandler<JoinCommunityRequestRejectedEvent>
{
  private readonly logger = new Logger(
    JoinCommunityRequestRejectedHandler.name,
  );

  constructor(private readonly eventsService: CommunitiesEventService) {}

  async handle(event: JoinCommunityRequestRejectedEvent) {
    await this.eventsService.emitJoinCommunityRequestRejectedEvent(event);
    this.logger.log(
      `Internal join community request rejected event handled: User ${event.userId} requested to join community ${event.communityId}`,
    );
  }
}
