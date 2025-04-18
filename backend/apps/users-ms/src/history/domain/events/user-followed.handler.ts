import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { HistoryService } from '@users-ms/history/application/history.service';
import { UserFollowedEvent } from '@users-ms/followers/domain/events/UserFollowedEvent';

@EventsHandler(UserFollowedEvent)
export class UserFollowedHandler implements IEventHandler<UserFollowedEvent> {
  private readonly logger = new Logger(UserFollowedHandler.name);

  constructor(private readonly historyService: HistoryService) {}

  async handle(event: UserFollowedEvent) {
    await this.historyService.registerUserFollowed(
      event.userId,
      event.followedUserId,
      event.date,
      event.followedUserEmail,
    );

    this.logger.log(
      `User followed event handled: User ${event.userId} followed user ${event.followedUserId}`,
    );
  }
}
