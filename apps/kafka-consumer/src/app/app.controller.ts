import { KAFKA_TOPICS } from '@/constants/kafka.constant';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  // Example consumer methods (add more as needed)
  @MessagePattern(KAFKA_TOPICS.POSTS.ADMIN.CREATE)
  async consumePostsAdminCreate(@Payload() message: any) {
    console.log(
      `Received message from ${KAFKA_TOPICS.POSTS.ADMIN.CREATE}`,
      message,
    );
    return { status: 'processed' };
  }
}
