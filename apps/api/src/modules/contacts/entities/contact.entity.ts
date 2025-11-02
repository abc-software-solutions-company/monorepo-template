import { Entity, Enum, Property } from '@mikro-orm/core';

import { AbstractEntity } from '@/common/entities/abstract.entity';

import { CONTACT_STATUS } from '../constants/contacts.constant';

@Entity({ tableName: 'contacts' })
export class Contact extends AbstractEntity {
  @Property({ type: 'varchar', length: 255 })
  name: string;

  @Property({ type: 'varchar', length: 320 })
  email: string;

  @Property({ type: 'varchar', length: 255, nullable: true })
  subject: string;

  @Property({ type: 'varchar', length: 5000 })
  message: string;

  @Property({ type: 'boolean', default: false })
  isRead: boolean = false;

  @Enum(() => CONTACT_STATUS)
  status: CONTACT_STATUS = CONTACT_STATUS.PUBLISHED;
}
