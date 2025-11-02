import { Expose } from 'class-transformer';
import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';

import { AbstractEntity } from '@/common/entities/abstract.entity';

import { User } from '@/modules/users/entities/user.entity';

import { AUDIT_LOG_HTTP_METHOD, AUDIT_LOG_TABLE_NAME } from '../constants/audit-logs.constant';

@Entity({ tableName: 'audit_logs' })
export class AuditLog extends AbstractEntity {
  @Property({ type: 'varchar', nullable: true })
  recordId: string;

  @Property({ type: 'jsonb', nullable: true })
  oldValue: Record<string, unknown>;

  @Property({ type: 'jsonb', nullable: true })
  newValue: Record<string, unknown>;

  @ManyToOne(() => User, { nullable: true })
  user: User;

  @Enum(() => AUDIT_LOG_HTTP_METHOD)
  action: AUDIT_LOG_HTTP_METHOD;

  @Enum(() => AUDIT_LOG_TABLE_NAME)
  tableName: AUDIT_LOG_TABLE_NAME;

  @Expose()
  title: string;
}
