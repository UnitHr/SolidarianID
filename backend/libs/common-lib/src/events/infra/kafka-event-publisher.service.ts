import { DomainEvent } from '@common-lib/common-lib/core/domain/DomainEvent';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KAFKA_SERVICE } from '@common-lib/common-lib/core/constants';
import { EventsService } from '../events.service';

@Injectable()
export class KafkaEventPublisherService extends EventsService {
  private readonly logger = new Logger(KafkaEventPublisherService.name);

  constructor(
    @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
  ) {
    super();
  }

  async publish<T extends DomainEvent>(topic: string, event: T): Promise<void> {
    this.kafkaClient.emit(topic, { value: JSON.stringify(event) });
    this.logger.log(
      `Event published to topic '${topic}': ${JSON.stringify(event)}`,
    );
  }
}
