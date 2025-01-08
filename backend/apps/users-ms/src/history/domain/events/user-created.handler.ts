import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { HistoryService } from '@users-ms/history/application/history.service';
import { UserCreatedEvent } from '@users-ms/users/domain/events/UserCreatedEvent';

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  private readonly logger = new Logger(UserCreatedHandler.name);

  constructor(private readonly historyService: HistoryService) {}

  async handle(event: UserCreatedEvent) {
    await this.historyService.createHistory(event.userId);
    this.logger.log(
      `History created for user registered with id: ${event.userId}`,
    );
  }
}
