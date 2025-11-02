import { Exclude } from 'class-transformer';
import { Entity, Property, OneToMany, OneToOne, Enum, Collection } from '@mikro-orm/core';

import { AbstractEntity } from '@/common/entities/abstract.entity';

import { AuditLog } from '@/modules/audit-logs/entities/audit-log.entity';
import { AUTH_PROVIDER, AUTH_TYPE } from '@/modules/auth/constants/auth.constant';
import { Category } from '@/modules/categories/entities/category.entity';
import { Post } from '@/modules/posts/entities/post.entity';
import { Product } from '@/modules/products/entities/product.entity';
import { RefreshToken } from '@/modules/refresh-tokens/entities/refresh-token.entity';
import { UserPreference } from '@/modules/users/entities/user-preference.entity';

import { USER_GENDER, USER_ROLE, USER_STATUS } from '../constants/users.constant';

@Entity({ tableName: 'users' })
export class User extends AbstractEntity {
  @Property({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @Property({ type: 'varchar', length: 320, nullable: true, unique: true })
  email: string;

  @Property({ type: 'varchar', nullable: true })
  avatar: string;

  @Property({ type: 'varchar', nullable: true })
  phoneNumber: string;

  @Property({ type: 'varchar', nullable: true, hidden: true })
  @Exclude()
  password: string;

  @Property({ type: 'boolean', nullable: true })
  emailVerified: boolean;

  @Property({ type: 'varchar', nullable: true })
  recoveryCode: string;

  @Property({ type: 'timestamp', nullable: true })
  recoveredAt: Date;

  @Property({ type: 'varchar', nullable: true })
  locale: string;

  @Property({ type: 'timestamp', nullable: true })
  dateOfBirth: Date;

  @Property({ type: 'varchar', nullable: true })
  country: string;

  @Property({ type: 'varchar', length: 2000, nullable: true })
  bio: string;

  @Property({ type: 'timestamp', nullable: true })
  lastLogin: Date;

  @Property({ nullable: true })
  providerAccountId: string;

  @Property({ type: 'varchar[]', nullable: true })
  deviceTokens: string[];

  @Enum(() => AUTH_PROVIDER)
  provider: AUTH_PROVIDER = AUTH_PROVIDER.CREDENTIALS;

  @Enum(() => AUTH_TYPE)
  authType: AUTH_TYPE = AUTH_TYPE.CREDENTIALS;

  @Enum(() => USER_GENDER)
  gender: USER_GENDER = USER_GENDER.MALE;

  @Enum(() => USER_STATUS)
  status: USER_STATUS = USER_STATUS.INACTIVE;

  @Enum(() => USER_ROLE)
  role: USER_ROLE = USER_ROLE.USER;

  @OneToMany(() => Post, post => post.creator)
  posts = new Collection<Post>(this);

  @OneToMany(() => Product, product => product.creator)
  products = new Collection<Product>(this);

  @OneToMany(() => Category, category => category.creator)
  categories = new Collection<Category>(this);

  @OneToMany(() => AuditLog, auditLog => auditLog.user)
  auditLogs = new Collection<AuditLog>(this);

  @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
  refreshTokens = new Collection<RefreshToken>(this);

  @OneToOne(() => UserPreference, userPreference => userPreference.user, { owner: true, nullable: true })
  preference: UserPreference;
}
