import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Faq } from './entities/faq.entity';
import { AdminFaqsController } from './admin-faqs.controller';
import { FaqsController } from './faqs.controller';
import { FaqsService } from './faqs.service';

@Module({
  imports: [MikroOrmModule.forFeature([Faq])],
  controllers: [FaqsController, AdminFaqsController],
  providers: [FaqsService, JwtService],
})
export class FaqsModule {}
