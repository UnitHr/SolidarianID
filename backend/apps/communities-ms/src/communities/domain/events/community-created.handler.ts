import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { CommunitiesEventService } from '@communities-ms/events/communities-events.service';
import { CommunityCreatedEvent } from './CommunityCreatedEvent';

@EventsHandler(CommunityCreatedEvent)
export class CommunityCreatedHandler
  implements IEventHandler<CommunityCreatedEvent>
{
  private readonly logger = new Logger(CommunityCreatedHandler.name);

  constructor(private readonly eventsService: CommunitiesEventService) {}

  async handle(event: CommunityCreatedEvent) {
    await this.eventsService.emitCommunityCreatedEvent(event);
    this.logger.log(
      `Internal community created event handled: Community ${event.communityId} created`,
    );
  }
}
