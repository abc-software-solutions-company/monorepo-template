import { Inject,Injectable, OnModuleInit  } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
    private readonly logger: PinoLogger,
  ) {}

  async onModuleInit() {
    // Subscribe to topics on module initialization
    await this.kafkaClient.subscribeToResponseOf('example.topic');
    await this.kafkaClient.connect();
  }

  // Produce a message to a Kafka topic
  async produceMessage(topic: string, message: Record<string, string>) {
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