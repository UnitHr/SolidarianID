import { Consumer, Kafka } from 'kafkajs';
import { Injectable } from '@nestjs/common';
import { log, error } from 'console';
import { kafkaConfig } from './kafka.config';

@Injectable()
export class KafkaConsumer {
  private kafka: Kafka;

  private consumer: Consumer;

  constructor() {
    this.kafka = new Kafka(kafkaConfig);
    this.consumer = this.kafka.consumer({ groupId: 'my-group' });
  }

  async connect(
    topic: string,
    groupId: string,
    handler: (message: any) => void,
  ) {
    try {
      await this.consumer.connect();
      log('Connected to Kafka succesfully');
      await this.consumer.subscribe({ topic, fromBeginning: false });
      log(`Subscribed to topic: ${topic}`);

      await this.consumer.run({
        eachMessage: async ({ partition, message }) => {
          log(`Message received in topic ${topic}:`);
          const msg = {
            partition,
            key: message.key?.toString(),
            value: message.value?.toString(),
          };
          log(msg);
          handler(msg);
        },
      });
    } catch (e) {
      error('Error while connecting to Kafka:', e);
      throw e;
    }
  }

  async disconnect() {
    await this.consumer.disconnect();
  }
}
