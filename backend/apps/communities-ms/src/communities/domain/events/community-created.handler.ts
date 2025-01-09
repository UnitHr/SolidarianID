import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CommunitiesEventService } from '@communities-ms/events/events.service';
import { Logger } from '@nestjs/common';
import { CommunityCreatedEvent } from './CommunityCreatedEvent';

@EventsHandler(CommunityCreatedEvent)
export class CommunityCreatedHandler
  implements IEventHandler<CommunityCreatedEvent>
{
  private readonly logger = new Logger(CommunityCreatedHandler.name);

  constructor(private readonly eventsService: CommunitiesEventService) {}

  async handle(event: CommunityCreatedEvent) {
    await this.eventsService.createCommunity(event);
    this.logger.log(
      `Internal community created event handled: Community ${event.communityId} created`,
    );
  }
}
