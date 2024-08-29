import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Content } from './entities/content.entity';
import { AdminContentsController } from './admin-contents.controller';
import { ContentsController } from './contents.controller';
import { ContentsService } from './contents.service';

@Module({
  imports: [TypeOrmModule.forFeature([Content])],
  controllers: [ContentsController, AdminContentsController],
  providers: [ContentsService, JwtService],
})
export class ContentsModule {}
