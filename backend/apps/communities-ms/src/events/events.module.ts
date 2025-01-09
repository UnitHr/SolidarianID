import { KafkaModule } from '@common-lib/common-lib/kafka/kafka.module';
import { Module } from '@nestjs/common';
import { CommunitiesEventService } from './events.service';

@Module({
  imports: [KafkaModule],
  providers: [CommunitiesEventService], // TODO: define interfaces for these services
  exports: [CommunitiesEventService],
})
export class EventsModule {}
