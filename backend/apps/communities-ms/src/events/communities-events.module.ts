import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { EventsModule } from '@common-lib/common-lib/events/events.module';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { EventsService } from '@common-lib/common-lib/events/events.service';
import { DomainEvent } from '@common-lib/common-lib/core/domain/DomainEvent';

@Module({
  imports: [EventsModule, CqrsModule],
})
export class CommunitiesEventsModule implements OnModuleInit {
  private readonly logger = new Logger(CommunitiesEventsModule.name);

  constructor(
    private readonly eventBus: EventBus,
    private readonly eventsService: EventsService,
  ) {}

  onModuleInit() {
    this.eventBus.subscribe(async (event: DomainEvent) => {
      this.logger.log(`Internal event captured: ${event.constructor.name}`);

      if (event.shouldBePublishedExternally()) {
        const eventType = event.getEventType();
        await this.eventsService.publish(eventType!, event);
      }
    });
  }
}
