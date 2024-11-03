import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AwsService } from './aws.service';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  providers: [AwsService],
  exports: [AwsService],
})
export class AwsModule {}
