import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { CommunitiesEventService } from '@communities-ms/events/communities-events.service';
import { UserJoinedCommunity } from './UserJoinedCommunity';

@EventsHandler(UserJoinedCommunity)
export class UserJoinedCommunityHandler
  implements IEventHandler<UserJoinedCommunity>
{
  private readonly logger = new Logger(UserJoinedCommunityHandler.name);

  constructor(private readonly eventsService: CommunitiesEventService) {}

  async handle(event: UserJoinedCommunity) {
    await this.eventsService.emitUserJoinedCommunityEvent(event);
    this.logger.log(
      `Internal user joined community event handled: User ${event.userId} joined community ${event.communityId}`,
    );
  }
}
