import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { CommunitiesEventService } from '@communities-ms/events/communities-events.service';
import { ActionCreatedEvent } from './ActionCreatedEvent';

@EventsHandler(ActionCreatedEvent)
export class ActionCreatedHandler implements IEventHandler<ActionCreatedEvent> {
  private readonly logger = new Logger(ActionCreatedHandler.name);

  constructor(private readonly eventsService: CommunitiesEventService) {}

  async handle(event: ActionCreatedEvent) {
    await this.eventsService.emitActionCreatedEvent(event);
    this.logger.log(
      `Internal action created event handled: Action ${event.id} created`,
    );
  }
}
