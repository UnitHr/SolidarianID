import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { HistoryService } from '@users-ms/history/application/history.service';
import { UserFollowedEvent } from '@users-ms/users/domain/events/UserFollowedEvent';
import { Logger } from '@nestjs/common';

@EventsHandler(UserFollowedEvent)
export class UserFollowedHandler implements IEventHandler<UserFollowedEvent> {
  private readonly logger = new Logger(UserFollowedHandler.name);

  constructor(private readonly historyService: HistoryService) {}

  handle(event: UserFollowedEvent) {
    this.historyService.registerUserFollowed(
      event.userId,
      event.followedUserId,
    );

    this.logger.log(
      `User with id: ${event.userId} followed user with id: ${event.followedUserId}`,
    );
  }
}
