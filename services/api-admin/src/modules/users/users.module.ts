import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UserPreference } from './entities/user-preference.entity';
import { UserCreatedListener, UserDeletedListener, UserUpdatedListener } from './listeners/users.listener';
import { AdminUsersController } from './admin-users.controller';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersPreferencesService } from './users-preferences.service';

import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuditLog } from '../audit-logs/entities/audit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserPreference, AuditLog])],
  controllers: [UsersController, AdminUsersController],
  providers: [UsersService, UsersPreferencesService, JwtService, UserCreatedListener, UserUpdatedListener, UserDeletedListener, AuditLogsService],
  exports: [UsersService],
})
export class UsersModule {}
