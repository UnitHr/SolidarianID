import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { DomainEvent } from '../core/domain/DomainEvent';
import { EventPublisher } from './event-publisher.interface';

@Injectable()
export class KafkaEventPublisherService extends EventPublisher {
  private readonly logger = new Logger(KafkaEventPublisherService.name);

  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka, // TODO: Improve the token injection
  ) {
    super();
  }

  async emitEvent(topic: string, event: DomainEvent): Promise<void> {
    this.logger.log(
      `Enviando evento al tópico ${topic}: ${JSON.stringify(event)}`,
    );
    this.kafkaClient.emit(topic, { value: JSON.stringify(event) });
  }
}
