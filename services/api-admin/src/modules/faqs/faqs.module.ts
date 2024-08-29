import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Faq } from './entities/faq.entity';
import { AdminFaqsController } from './admin-faqs.controller';
import { FaqsController } from './faqs.controller';
import { FaqsService } from './faqs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Faq])],
  controllers: [FaqsController, AdminFaqsController],
  providers: [FaqsService, JwtService],
})
export class FaqsModule {}
