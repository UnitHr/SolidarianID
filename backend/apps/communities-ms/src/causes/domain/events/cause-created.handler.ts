import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { CommunitiesEventService } from '@communities-ms/events/events.service';
import { CauseCreatedEvent } from './CauseCreatedEvent';

@EventsHandler(CauseCreatedEvent)
export class CauseCreatedEventHandler
  implements IEventHandler<CauseCreatedEvent>
{
  private readonly logger = new Logger(CauseCreatedEventHandler.name);

  constructor(private readonly eventsService: CommunitiesEventService) {}

  async handle(event: CauseCreatedEvent) {
    await this.eventsService.emitCauseCreatedEvent(event);
    this.logger.log(
      `Internal cause created event handled: Cause ${event.causeId} created`,
    );
  }
}
