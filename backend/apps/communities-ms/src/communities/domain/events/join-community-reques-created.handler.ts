import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CommunitiesEventService } from '@communities-ms/events/events.service';
import { Logger } from '@nestjs/common';
import { JoinCommunityRequestCreatedEvent } from './JoinCommunityRequestCreatedEvent';

@EventsHandler(JoinCommunityRequestCreatedEvent)
export class JoinCommunityRequestCreatedHandler
  implements IEventHandler<JoinCommunityRequestCreatedEvent>
{
  private readonly logger = new Logger(JoinCommunityRequestCreatedHandler.name);

  constructor(private readonly eventsService: CommunitiesEventService) {}

  async handle(event: JoinCommunityRequestCreatedEvent) {
    this.logger.log(
      `Processing internal join community request created event: ${event}`,
    );
    await this.eventsService.createJoinCommunityRequest(event);
  }
}
