import { Module } from '@nestjs/common';
import { EventsModule } from '@common-lib/common-lib/events/events.module';
import { CommunitiesEventService } from './communities-events.service';

@Module({
  imports: [EventsModule],
  providers: [CommunitiesEventService], // TODO: define interfaces for these services
  exports: [CommunitiesEventService],
})
export class CommunitiesEventsModule {}
