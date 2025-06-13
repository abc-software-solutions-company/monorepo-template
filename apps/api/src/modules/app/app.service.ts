import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { KafkaService } from '@/common/kafka/kafka.service';

@Injectable()
export class AppService {
  constructor(
    @Inject('HERO_SERVICE') private readonly client: ClientKafka,
    private readonly kafkaService: KafkaService
) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('hero.kill.dragon');

    await this.client.connect();
  }


  getHello(): string {
    return 'Hello World!';
  }

  async healthCheckKafka(): Promise<string> {
    await this.kafkaService.produceMessage('example.topic', { message: 'Hello Kafka!' });

    return 'Kafka health good'
  }
}
