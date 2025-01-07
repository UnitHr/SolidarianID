import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { DomainEvent } from '../core/domain/DomainEvent';
import { EventPublisher } from './event-publisher.interface';

@Injectable()
export class KafkaEventPublisherService extends EventPublisher {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka, // TODO: Improve the token injection
  ) {
    super();
  }

  async emitEvent(topic: string, event: DomainEvent): Promise<void> {
    console.log(`Enviando evento al tópico ${topic}:`, event); // Log de depuración
    this.kafkaClient.emit(topic, { value: JSON.stringify(event) });
  }
}
