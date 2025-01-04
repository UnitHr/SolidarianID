import { Producer, Kafka } from 'kafkajs';
import { Injectable } from '@nestjs/common';
import { kafkaConfig } from './kafka.config';

@Injectable()
export class KafkaProducer {
  private producer: Producer;

  constructor(private kafka: Kafka) {
    this.kafka = new Kafka(kafkaConfig);
    this.producer = this.kafka.producer();
  }

  async connect() {
    try {
      await this.producer.connect();
    } catch (error) {
      error('Error connecting the Kafka producer:', error);
      throw new Error('Connection failed');
    }
  }

  async publish(topic: string, message: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }

  async disconnect() {
    await this.producer.disconnect();
  }
}
