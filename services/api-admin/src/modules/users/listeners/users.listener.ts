import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { AuditLogsService } from '@/modules/audit-logs/audit-logs.service';
import { AUDIT_LOG_HTTP_METHOD, AUDIT_LOG_TABLE_NAME } from '@/modules/audit-logs/constants/audit-logs.constant';

import { UserCreatedEvent, UserDeletedEvent, UserUpdatedEvent } from '../events/users.event';

@Injectable()
export class UserCreatedListener {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @OnEvent('user.created')
  async handleUserCreatedEvent(event: UserCreatedEvent) {
    const { creator, afterCreate } = event;

    if (!creator) return;

    try {
      // Create Audit Log
      await this.auditLogsService.create({
        tableName: AUDIT_LOG_TABLE_NAME.USERS,
        action: AUDIT_LOG_HTTP_METHOD.CREATE,
        user: creator,
        recordId: creator.id,
        oldValue: {},
        newValue: { ...afterCreate },
      });
    } catch (error) {
      throw new UnprocessableEntityException('Event user.created::' + error.message);
    }
  }
}

@Injectable()
export class UserUpdatedListener {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @OnEvent('user.updated')
  async handleUserUpdatedEvent(event: UserUpdatedEvent) {
    const { creator, beforeUpdate, afterUpdate } = event;

    try {
      // Create Audit Log
      await this.auditLogsService.create({
        tableName: AUDIT_LOG_TABLE_NAME.USERS,
        action: AUDIT_LOG_HTTP_METHOD.UPDATE,
        user: creator,
        recordId: beforeUpdate.id,
        oldValue: { ...beforeUpdate },
        newValue: { ...afterUpdate },
      });
    } catch (error) {
      throw new UnprocessableEntityException('Event user.updated::' + error.message);
    }
  }
}

@Injectable()
export class UserDeletedListener {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @OnEvent('user.deleted')
  async handleUserDeletedEvent(event: UserDeletedEvent) {
    const { creator, beforeDelete, afterDelete } = event;

    try {
      // Create Audit Log
      for (let i = 0; i < beforeDelete.length; i++) {
        const previousData = beforeDelete[i];
        const currentData = afterDelete[i];

        await this.auditLogsService.create({
          tableName: AUDIT_LOG_TABLE_NAME.USERS,
          action: AUDIT_LOG_HTTP_METHOD.DELETE,
          user: creator,
          recordId: previousData.id,
          oldValue: { ...previousData },
          newValue: { ...currentData },
        });
      }
    } catch (error) {
      throw new UnprocessableEntityException('Event user.deleted::' + error.message);
    }
  }
}
