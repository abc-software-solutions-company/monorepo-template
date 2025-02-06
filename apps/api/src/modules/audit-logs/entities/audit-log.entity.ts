import { Expose } from 'class-transformer';
import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '@/common/entities/abstract.entity';

import { User } from '@/modules/users/entities/user.entity';

import { AUDIT_LOG_HTTP_METHOD, AUDIT_LOG_TABLE_NAME } from '../constants/audit-logs.constant';

@Entity({ name: 'audit_logs' })
export class AuditLog extends AbstractEntity {
  @Column({ type: 'varchar', nullable: true })
  recordId: string;

  @Column({ type: 'jsonb', nullable: true })
  oldValue: Record<string, unknown>;

  @Column({ type: 'jsonb', nullable: true })
  newValue: Record<string, unknown>;

  @ManyToOne(() => User, user => user.auditLogs)
  user: User;

  @Column({ type: 'varchar', length: 50, enum: AUDIT_LOG_HTTP_METHOD })
  action: AUDIT_LOG_HTTP_METHOD;

  @Column({ type: 'varchar', length: 50, enum: AUDIT_LOG_TABLE_NAME })
  tableName: AUDIT_LOG_TABLE_NAME;

  @Expose()
  title: string;
}
