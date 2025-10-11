import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import kafkaConfig from '@/configs/kafka.config';

import { KafkaService } from './kafka.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: kafkaConfig().brokers,
            clientId: kafkaConfig().clientId,
          },
          consumer: {
            groupId: kafkaConfig().groupId,
          },
        },
      },
    ]),
  ],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}