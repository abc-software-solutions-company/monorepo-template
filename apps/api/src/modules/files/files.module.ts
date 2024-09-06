import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { File } from './entities/file.entity';
import { AdminFilesController } from './admin-files.controller';
import { FilesService } from './files.service';

import { AwsService } from '../aws/aws.service';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([File]), CategoriesModule],
  controllers: [AdminFilesController],
  providers: [FilesService, JwtService, AwsService],
  exports: [FilesService],
})
export class FilesModule {}
