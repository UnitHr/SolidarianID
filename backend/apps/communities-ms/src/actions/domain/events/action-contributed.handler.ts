import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { CommunitiesEventService } from '@communities-ms/events/events.service';
import { ActionContributedEvent } from './ActionContributedEvent';
import { ActionCreatedHandler } from './action-created.handler';

@EventsHandler(ActionContributedEvent)
export class ActionContributedEventHandler
  implements IEventHandler<ActionContributedEvent>
{
  private readonly logger = new Logger(ActionCreatedHandler.name);

  constructor(private readonly eventsService: CommunitiesEventService) {}

  async handle(event: ActionContributedEvent) {
    await this.eventsService.emitActionContributedEvent(event);
    this.logger.log(
      `Internal action contributed event handled: Action ${event.actionId} contributed`,
    );
  }
}
