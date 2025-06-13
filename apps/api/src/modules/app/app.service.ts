import {  Injectable } from '@nestjs/common';

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
    await this.kafkaService.produceMessage('example.topic', { message: 'Hello Kafka!' });

    return 'Kafka health good'
  }
}
