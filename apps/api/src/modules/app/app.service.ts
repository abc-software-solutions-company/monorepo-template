import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  constructor(@Inject('HERO_SERVICE') private readonly client: ClientKafka) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('hero.kill.dragon');

    await this.client.connect();
  }
}
