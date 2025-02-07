import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Category } from './entities/category.entity';
import { CategoryFile } from './entities/category-file.entity';
import { AdminCategoriesController } from './admin-categories.controller';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuditLog } from '../audit-logs/entities/audit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, CategoryFile, AuditLog])],
  controllers: [AdminCategoriesController, CategoriesController],
  providers: [CategoriesService, JwtService, AuditLogsService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
