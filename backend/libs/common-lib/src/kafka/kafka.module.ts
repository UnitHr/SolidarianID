import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { kafkaConfig } from './kafka.config';
import { EventPublisher } from './event-publisher.interface';
import { KafkaEventPublisherService } from './kafka-event-publisher.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        ...kafkaConfig,
      },
    ]),
  ],
  providers: [
    {
      provide: EventPublisher,
      useClass: KafkaEventPublisherService,
    },
  ],
  exports: [EventPublisher, ClientsModule],
})
export class KafkaModule {}
