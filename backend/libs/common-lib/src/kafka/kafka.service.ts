import { Injectable } from '@nestjs/common';
import { Kafka, Producer, Consumer, ConsumerRunConfig } from 'kafkajs';
import { log } from 'console';
import { kafkaConfig } from './kafka.config';

@Injectable()
export class KafkaService {
  private kafka: Kafka;

  private producer: Producer;

  private consumers: Consumer[] = [];

  constructor() {
    this.kafka = new Kafka(kafkaConfig);
    this.producer = this.kafka.producer();
  }

  async connectProducer() {
    try {
      await this.producer.connect();
      log('Producer connected to Kafka.');
    } catch (error) {
      error('Error connecting the producer:', error);
      throw error;
    }
  }

  async sendMessage(
    topic: string,
    messages: { key?: string; value: string }[],
  ) {
    try {
      await this.producer.send({
        topic,
        messages,
      });
      log(`Message sent to the topic ${topic}:`, messages);
    } catch (error) {
      error('Error sending the message ', error);
      throw error;
    }
  }

  async connectConsumer(
    topic: string,
    groupId: string,
    onMessage: (message: unknown) => void,
    consumerConfig?: Partial<ConsumerRunConfig>,
  ) {
    const consumer = this.kafka.consumer({ groupId });

    try {
      await consumer.connect();
      log(`Consumidor conectado al grupo ${groupId}.`);

      await consumer.subscribe({ topic, fromBeginning: false });
      log(`Suscrito al tema: ${topic}`);

      await consumer.run({
        eachMessage: async ({ partition, message }) => {
          const msg = {
            topic,
            partition,
            key: message.key?.toString(),
            value: message.value?.toString(),
          };
          log('Message received:', msg);
          onMessage(msg);
        },
        ...consumerConfig,
      });

      this.consumers.push(consumer);
    } catch (error) {
      error('Error connecting the consumer:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await Promise.all([
        this.producer.disconnect(),
        ...this.consumers.map((consumer) => consumer.disconnect()),
      ]);
      log('Kafka connections closed.');
    } catch (error) {
      error('Error closing the kafka connections: ', error);
    }
  }
}
