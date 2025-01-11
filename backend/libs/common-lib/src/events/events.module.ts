import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { kafkaConfig } from './infra/kafka.config';
import { EventsService } from './events.service';
import { KafkaEventPublisherService } from './infra/kafka-event-publisher.service';
import { KAFKA_SERVICE } from '../core/constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: KAFKA_SERVICE,
        ...kafkaConfig,
      },
    ]),
  ],
  providers: [
    {
      provide: EventsService,
      useClass: KafkaEventPublisherService,
    },
  ],
  exports: [EventsService],
})
export class EventsModule {}
