import {  Injectable } from '@nestjs/common';

import { KAFKA_TOPICS } from '@/common/kafka/constants/kafka.constant';
import { KafkaService } from '@/common/kafka/kafka.service';

@Injectable()
export class AppService {
  constructor(
    private readonly kafkaService: KafkaService
) {}


  getHello(): string {
    return 'Hello World!';
  }

  async healthCheckKafka(): Promise<string> {
    await this.kafkaService.produceMessage(KAFKA_TOPICS.SYSTEM.HEALTH_CHECK, { message: 'Hello Kafka!' });

    return 'Kafka health good'
  }
}
