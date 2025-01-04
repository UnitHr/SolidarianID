import { Module, Global } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { KafkaProducer } from './producer.kafka';
import { KafkaConsumer } from './consumer.kafka';
import { kafkaConfig } from './kafka.config';

@Global()
@Module({
  providers: [
    {
      provide: Kafka,
      useFactory: () => new Kafka(kafkaConfig),
    },
    KafkaProducer,
    KafkaConsumer,
  ],
  exports: [KafkaProducer, KafkaConsumer],
})
export class KafkaModule {}
