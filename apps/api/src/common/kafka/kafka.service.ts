import { Inject,Injectable, OnModuleInit  } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { PinoLogger } from 'nestjs-pino';

import { KAFKA_TOPICS } from './constants/kafka.constant';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
    private readonly logger: PinoLogger,
  ) {}

  async onModuleInit() {
    // Flatten KAFKA_TOPICS into an array of topic strings
    const topics = this.getAllTopics(KAFKA_TOPICS);

    // Subscribe to all topics
    for (const topic of topics) {
      await this.kafkaClient.subscribeToResponseOf(topic);
    }
    await this.kafkaClient.connect();
  }

  // Helper method to extract all topic strings from the nested KAFKA_TOPICS object
  private getAllTopics(topicsObj: any, result: string[] = []): string[] {
    for (const key in topicsObj) {
      if (typeof topicsObj[key] === 'object' && topicsObj[key] !== null) {
        this.getAllTopics(topicsObj[key], result);
      } else if (typeof topicsObj[key] === 'string') {
        result.push(topicsObj[key]);
      }
    }

    return result;
  }

  // Produce a message to a Kafka topic
  async sendMessage<T extends object>(topic: string, message: T) {
    try {
      await this.kafkaClient.emit(topic, {
        key: `${Date.now()}`, // Optional: message key
        value: JSON.stringify(message),
      });
      this.logger.info(`Message sent to topic ${topic}:`, message);
    } catch (error) {
      this.logger.error(`Error sending message to ${topic}:`, error);
    }
  }
}