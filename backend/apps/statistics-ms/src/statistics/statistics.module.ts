import { Module, OnModuleInit, Inject } from '@nestjs/common';
import { KafkaModule } from '@common-lib/common-lib/kafka/kafka.module';
import { ClientKafka } from '@nestjs/microservices';
import { StatisticsController } from './application/statistics.controller';

@Module({
  imports: [KafkaModule],
  controllers: [StatisticsController],
  providers: [],
})
export class StatisticsModule implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
    console.log('Kafka consumer connected to topic action-created');
  }

  async onModuleDestroy() {
    await this.kafkaClient.close();
    console.log('Kafka consumer disconnected from topic action-created');
  }
}
