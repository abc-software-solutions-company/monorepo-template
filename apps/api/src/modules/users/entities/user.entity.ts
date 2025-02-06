import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { AbstractEntity } from '@/common/entities/abstract.entity';

import { AuditLog } from '@/modules/audit-logs/entities/audit-log.entity';
import { AUTH_PROVIDER, AUTH_TYPE } from '@/modules/auth/constants/auth.constant';
import { Category } from '@/modules/categories/entities/category.entity';
import { Post } from '@/modules/posts/entities/post.entity';
import { Product } from '@/modules/products/entities/product.entity';
import { RefreshToken } from '@/modules/refresh-tokens/entities/refresh-token.entity';
import { UserPreference } from '@/modules/users/entities/user-preference.entity';

import { USER_GENDER, USER_ROLE, USER_STATUS } from '../constants/users.constant';

@Entity({ name: 'users' })
export class User extends AbstractEntity {
  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 320, nullable: true, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  avatar: string;

  @Column({ type: 'varchar', nullable: true })
  phoneNumber: string;

  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  password: string;

  @Column({ type: 'boolean', nullable: true })
  emailVerified: boolean;

  @Column({ type: 'varchar', nullable: true })
  recoveryCode: string;

  @Column({ type: 'timestamp without time zone', nullable: true })
  recoveredAt: Date;

  @Column({ type: 'varchar', nullable: true })
  locale: string;

  @Column({ type: 'timestamp without time zone', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'varchar', nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 2000, nullable: true })
  bio: string;

  @Column({ type: 'timestamp without time zone', nullable: true })
  lastLogin: Date;

  @Column({ nullable: true })
  providerAccountId: string;

  @Column({ type: 'varchar', array: true, nullable: true })
  deviceTokens: string[];

  @Column({ type: 'varchar', length: 50, enum: AUTH_PROVIDER, default: AUTH_PROVIDER.CREDENTIALS })
  provider: AUTH_PROVIDER;

  @Column({ type: 'varchar', length: 50, enum: AUTH_TYPE, default: AUTH_TYPE.CREDENTIALS })
  authType: AUTH_TYPE;

  @Column({ type: 'varchar', length: 50, enum: USER_GENDER, default: USER_GENDER.MALE })
  gender: USER_GENDER;

  @Column({ type: 'varchar', length: 50, default: USER_STATUS.INACTIVE })
  status: USER_STATUS;

  @Column({ type: 'varchar', length: 50, enum: USER_ROLE, default: USER_ROLE.USER })
  role: USER_ROLE;

  @OneToMany(() => Post, post => post.creator)
  posts: Post[];

  @OneToMany(() => Product, product => product.creator)
  products: Product[];

  @OneToMany(() => Category, category => category.creator)
  categories: Category[];

  @OneToMany(() => AuditLog, auditLog => auditLog.user)
  auditLogs: AuditLog[];

  @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
  refreshTokens: RefreshToken[];

  @OneToOne(() => UserPreference, userPreference => userPreference.user)
  @JoinColumn()
  preference: UserPreference;
}
