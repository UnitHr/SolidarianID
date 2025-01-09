import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { CommunitiesEventService } from '@communities-ms/events/communities-events.service';
import { CauseSupportedEvent } from './CauseSupportedEvent';

@EventsHandler(CauseSupportedEvent)
export class CauseSupportedEventHandler
  implements IEventHandler<CauseSupportedEvent>
{
  private readonly logger = new Logger(CauseSupportedEventHandler.name);

  constructor(private readonly eventsService: CommunitiesEventService) {}

  async handle(event: CauseSupportedEvent) {
    await this.eventsService.emitCauseSupportedEvent(event);
    this.logger.log(
      `Cause supported event handled: Cause:${event.causeId} add supporter User:${event.userId}`,
    );
  }
}
