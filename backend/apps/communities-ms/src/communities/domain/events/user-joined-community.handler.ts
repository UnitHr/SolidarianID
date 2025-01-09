import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { CommunitiesEventService } from '@communities-ms/events/events.service';
import { UserJoinedCommunity } from './UserJoinedCommunity';

@EventsHandler(UserJoinedCommunity)
export class UserJoinedCommunityHandler
  implements IEventHandler<UserJoinedCommunity>
{
  private readonly logger = new Logger(UserJoinedCommunityHandler.name);

  constructor(private readonly eventsService: CommunitiesEventService) {}

  async handle(event: UserJoinedCommunity) {
    this.logger.log(
      `Processing internal user joined community event: ${event}`,
    );
    await this.eventsService.createUserJoinedCommunity(event);
  }
}
