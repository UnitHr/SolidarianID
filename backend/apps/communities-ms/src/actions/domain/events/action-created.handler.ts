import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CommunitiesEventService } from '@communities-ms/events/events.service';
import { Logger } from '@nestjs/common';
import { ActionCreatedEvent } from './ActionCreatedEvent';

@EventsHandler(ActionCreatedEvent)
export class ActionCreatedHandler implements IEventHandler<ActionCreatedEvent> {
  private readonly logger = new Logger(ActionCreatedHandler.name);

  constructor(private readonly eventsService: CommunitiesEventService) {}

  async handle(event: ActionCreatedEvent) {
    this.logger.log(`Processing internal action created event: ${event}`);
    this.eventsService.emitActionCreatedEvent(event);
  }
}
