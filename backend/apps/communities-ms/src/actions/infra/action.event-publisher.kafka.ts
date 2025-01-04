import { DomainEvent } from '@common-lib/common-lib/core/domain/DomainEvent';
import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { KafkaProducer } from '@common-lib/common-lib/kafka/producer.kafka';
import { envs } from '@communities-ms/config';
import { ActionEventPublisher } from '../action.event-publisher';

@Injectable()
export class ActionEventPublisherKafka extends ActionEventPublisher {
  constructor(
    private readonly producer: KafkaProducer,
    eventBus: EventBus<DomainEvent>,
  ) {
    super(eventBus);
  }

  async publish(event: DomainEvent): Promise<void> {
    // Send the event to Kafka (as a message in a specific topic)
    await this.producer.connect();

    const topic = envs.kafkaTopicCommunities;
    const message = { value: JSON.stringify(event) };

    await this.producer.publish(topic, message);
    await this.producer.disconnect();
  }
}
