import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import { AbstractEntity } from '@/common/entities/abstract.entity';

import { User } from '@/modules/users/entities/user.entity';

@Entity({ tableName: 'refresh_tokens' })
export class RefreshToken extends AbstractEntity {
  @Property()
  token: string;

  @Property()
  createdByIp: string;

  @Property({ nullable: true })
  revokedByIp?: string;

  @Property({ type: 'timestamp', nullable: true })
  revokedAt?: Date;

  @Property()
  userAgent: string;

  @ManyToOne(() => User, { fieldName: 'user_id' })
  user: User;
}
